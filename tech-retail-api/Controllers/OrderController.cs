using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;
using ProductManagementAPI.Services;
using System.Security.Claims;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(AppDbContext context, IEmailService emailService, ILogger<OrderController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        private int GetUserIdFromToken()
        {

            var userIdClaim = User.FindFirst("userId")?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst("sub")?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == 0)
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu Id người dùng. Vui lòng đăng nhập lại." });

            if (request.CartItemIds == null || request.CartItemIds.Count == 0)
                return BadRequest(new { Message = "Vui lòng chọn ít nhất một sản phẩm để thanh toán." });

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId && request.CartItemIds.Contains(c.Id))
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest(new { Message = "Không tìm thấy sản phẩm đã chọn trong giỏ hàng." });

            foreach (var item in cartItems)
            {
                if (item.Product == null)
                    return BadRequest($"Sản phẩm mã #{item.ProductId} không tồn tại.");

                if (item.Product.Stock < item.Quantity)
                {
                    return BadRequest($"Sản phẩm '{item.Product.Name}' chỉ còn {item.Product.Stock} cái trong kho, không đủ số lượng bạn đặt ({item.Quantity}).");
                }
            }

            decimal subtotal = cartItems.Sum(c => c.Quantity * c.Product!.Price);
            decimal discount = 0;
            Voucher? appliedVoucher = null;

            if (!string.IsNullOrWhiteSpace(request.VoucherCode))
            {
                var (voucher, error) = await VoucherController.ValidateAsync(_context, request.VoucherCode, subtotal);
                if (error != null) return BadRequest(new { Message = error });

                appliedVoucher = voucher;
                discount = VoucherController.CalculateDiscount(voucher!, subtotal);
            }

            foreach (var item in cartItems)
            {
                item.Product!.Stock -= item.Quantity;
            }

            if (appliedVoucher != null)
            {
                appliedVoucher.UsedCount += 1;
            }

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                Status = "Pending",
                TotalAmount = subtotal - discount,
                OrderItems = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    Price = c.Product!.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Đặt hàng thành công!", OrderId = order.Id, Total = order.TotalAmount, Discount = discount });
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserIdFromToken();
            if (userId == 0)
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu Id người dùng. Vui lòng đăng nhập lại." });

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] string? status = null)
        {
            var query = _context.Orders.AsQueryable();
            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => o.Status == status);
            }

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    Username = _context.Users.Where(u => u.Id == o.UserId).Select(u => u.Username).FirstOrDefault(),
                    Email = _context.Users.Where(u => u.Id == o.UserId).Select(u => u.Email).FirstOrDefault(),
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        ProductName = oi.Product != null ? oi.Product.Name : "(Sản phẩm đã xóa)",
                        oi.Quantity,
                        oi.Price
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromQuery] string newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound("Không tìm thấy đơn hàng.");

            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(newStatus))
                return BadRequest("Trạng thái không hợp lệ. Chỉ chấp nhận: Pending, Processing, Shipped, Delivered, Cancelled.");

            order.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Cập nhật trạng thái đơn hàng #{id} thành '{newStatus}' thành công!" });
        }
    }

    public class CheckoutRequestDto
    {
        public List<int> CartItemIds { get; set; } = new();
        public string? VoucherCode { get; set; }
    }
}
