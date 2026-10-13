using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarrantyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WarrantyController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst("userId")?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst("sub")?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        [HttpGet("lookup/{code}")]
        [AllowAnonymous]
        public async Task<IActionResult> Lookup(string code)
        {
            code = code.Trim().ToUpperInvariant();

            var w = await _context.Warranties
                .Include(x => x.Product)
                .FirstOrDefaultAsync(x => x.Code == code);

            if (w == null)
                return NotFound(new { Message = "Không tìm thấy mã bảo hành này." });

            var now = DateTime.Now;
            var isActive = !w.IsVoided && now <= w.EndDate;

            return Ok(new
            {
                w.Code,
                ProductName = w.Product != null ? w.Product.Name : "(Sản phẩm đã xóa)",
                w.StartDate,
                w.EndDate,
                IsActive = isActive,
                Status = w.IsVoided ? "Voided" : (isActive ? "Active" : "Expired"),
                DaysLeft = isActive ? (int)Math.Ceiling((w.EndDate - now).TotalDays) : 0
            });
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyWarranties()
        {
            var userId = GetUserIdFromToken();
            if (userId == 0)
                return Unauthorized(new { Message = "Token không hợp lệ. Vui lòng đăng nhập lại." });

            var now = DateTime.Now;

            var list = await _context.Warranties
                .Include(x => x.Product)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.StartDate)
                .Select(x => new
                {
                    x.Code,
                    x.OrderId,
                    x.ProductId,
                    ProductName = x.Product != null ? x.Product.Name : "(Sản phẩm đã xóa)",
                    x.StartDate,
                    x.EndDate,
                    IsActive = !x.IsVoided && now <= x.EndDate,
                    Status = x.IsVoided ? "Voided" : (now <= x.EndDate ? "Active" : "Expired")
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}