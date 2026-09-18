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

        public OrderController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst("sub")?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = GetUserIdFromToken();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Giỏ hàng của bạn đang trống.");

            foreach (var item in cartItems)
            {
                if (item.Product == null)
                    return BadRequest($"Sản phẩm mã #{item.ProductId} không tồn tại.");

                if (item.Product.Stock < item.Quantity)
                {
                    return BadRequest($"Sản phẩm '{item.Product.Name}' chỉ còn {item.Product.Stock} cái trong kho, không đủ số lượng bạn đặt ({item.Quantity}).");
                }
            }

            foreach (var item in cartItems)
            {
                item.Product!.Stock -= item.Quantity;
            }

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                Status = "Pending",
                TotalAmount = cartItems.Sum(c => c.Quantity * c.Product!.Price),
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

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                _ = _emailService.SendOrderConfirmationEmailAsync("tranphanvietquang@gmail.com", order.Id, order.TotalAmount);
            }

            return Ok(new { Message = "Đặt hàng thành công!", OrderId = order.Id, Total = order.TotalAmount });
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserIdFromToken();
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
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
}