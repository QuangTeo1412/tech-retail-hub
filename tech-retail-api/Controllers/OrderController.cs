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
        private readonly WarrantyService _warrantyService;

        public OrderController(
            AppDbContext context,
            IEmailService emailService,
            ILogger<OrderController> logger,
            WarrantyService warrantyService)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
            _warrantyService = warrantyService;
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
                .Include(cartItems => cartItems.Product)
                .Where(cartItems => cartItems.UserId == userId && request.CartItemIds.Contains(cartItems.Id))
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

            decimal subtotal = cartItems.Sum(cartItems => cartItems.Quantity * cartItems.Product!.Price);
            decimal discount = 0;

            Voucher? appliedVoucher = null;

            if (!string.IsNullOrWhiteSpace(request.VoucherCode))
            {
                var (voucher, error) = await VoucherController.ValidateAsync(_context, request.VoucherCode, subtotal);

                if (error != null)
                    return BadRequest(new { Message = error });

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
                OrderItems = cartItems.Select(cartItems => new OrderItem
                {
                    ProductId = cartItems.ProductId,
                    Quantity = cartItems.Quantity,
                    Price = cartItems.Product!.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Đặt hàng thành công!",
                OrderId = order.Id,
                Total = order.TotalAmount,
                Discount = discount
            });
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserIdFromToken();

            if (userId == 0)
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu Id người dùng. Vui lòng đăng nhập lại." });

            var orders = await _context.Orders
                .Include(order => order.OrderItems)
                .ThenInclude(item => item.Product)
                .Where(order => order.UserId == userId)
                .OrderByDescending(order => order.OrderDate)
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
                query = query.Where(currentOrder => currentOrder.Status == status);
            }

            var orders = await query
                .OrderByDescending(order => order.OrderDate)
                .Select(order => new
                {
                    order.Id,
                    order.UserId,
                    Username = _context.Users
                        .Where(user => user.Id == order.UserId)
                        .Select(user => user.Username)
                        .FirstOrDefault(),
                    Email = _context.Users
                        .Where(user => user.Id == order.UserId)
                        .Select(user => user.Email)
                        .FirstOrDefault(),
                    order.OrderDate,
                    order.TotalAmount,
                    order.Status,
                    Items = order.OrderItems.Select(item => new
                    {
                        item.ProductId,
                        item.Quantity,
                        item.Price,
                        ProductName = item.Product != null
                            ? item.Product.Name
                            : "(Sản phẩm đã xóa)",
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(
            int id,
            [FromQuery] string newStatus)
        {
            var order = await _context.Orders
                .Include(order => order.OrderItems)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(order => order.Id == id);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng.");

            var validStatuses = new[]
            {
                "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
            };

            if (!validStatuses.Contains(newStatus))
                return BadRequest("Trạng thái không hợp lệ. Chỉ chấp nhận: Pending, Processing, Shipped, Delivered, Cancelled.");

            order.Status = newStatus;

            var warrantyCount = 0;

            if (newStatus == "Delivered")
            {
                warrantyCount = await _warrantyService.IssueForOrderAsync(order, DateTime.Now);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Cập nhật trạng thái đơn hàng #{id} thành '{newStatus}' thành công!",
                WarrantiesIssued = warrantyCount
            });
        }
    }

    public class CheckoutRequestDto
    {
        public List<int> CartItemIds { get; set; } = new();
        public string? VoucherCode { get; set; }
    }
}