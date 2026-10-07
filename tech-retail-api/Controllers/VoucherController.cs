using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VoucherController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var vouchers = await _context.Vouchers.OrderByDescending(v => v.Id).ToListAsync();
            return Ok(vouchers);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Voucher voucher)
        {
            voucher.Code = (voucher.Code ?? string.Empty).Trim().ToUpperInvariant();
            if (string.IsNullOrWhiteSpace(voucher.Code))
                return BadRequest(new { message = "Vui lòng nhập mã giảm giá." });

            if (voucher.DiscountType != "Percent" && voucher.DiscountType != "Fixed")
                return BadRequest(new { message = "DiscountType chỉ nhận 'Percent' hoặc 'Fixed'." });

            if (voucher.DiscountValue <= 0)
                return BadRequest(new { message = "Giá trị giảm phải lớn hơn 0." });

            if (await _context.Vouchers.AnyAsync(v => v.Code == voucher.Code))
                return BadRequest(new { message = "Mã giảm giá này đã tồn tại." });

            voucher.Id = 0;
            voucher.UsedCount = 0;
            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();

            return Ok(voucher);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Voucher update)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) return NotFound(new { message = "Không tìm thấy mã giảm giá." });

            if (update.DiscountType != "Percent" && update.DiscountType != "Fixed")
                return BadRequest(new { message = "DiscountType chỉ nhận 'Percent' hoặc 'Fixed'." });

            voucher.DiscountType = update.DiscountType;
            voucher.DiscountValue = update.DiscountValue;
            voucher.MaxDiscountAmount = update.MaxDiscountAmount;
            voucher.MinOrderAmount = update.MinOrderAmount;
            voucher.ExpiresAt = update.ExpiresAt;
            voucher.UsageLimit = update.UsageLimit;
            voucher.IsActive = update.IsActive;

            await _context.SaveChangesAsync();
            return Ok(voucher);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) return NotFound(new { message = "Không tìm thấy mã giảm giá." });

            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa mã giảm giá." });
        }
        public class PreviewRequest
        {
            public string Code { get; set; } = string.Empty;
            public decimal OrderAmount { get; set; }
        }

        [HttpPost("preview")]
        [Authorize]
        public async Task<IActionResult> Preview([FromBody] PreviewRequest request)
        {
            var (voucher, error) = await ValidateAsync(_context, request.Code, request.OrderAmount);
            if (error != null) return BadRequest(new { message = error });

            var discount = CalculateDiscount(voucher!, request.OrderAmount);
            return Ok(new { code = voucher!.Code, discountAmount = discount });
        }
        internal static async Task<(Voucher? voucher, string? error)> ValidateAsync(AppDbContext context, string? code, decimal orderAmount)
        {
            code = (code ?? string.Empty).Trim().ToUpperInvariant();
            if (string.IsNullOrWhiteSpace(code)) return (null, "Vui lòng nhập mã giảm giá.");

            var voucher = await context.Vouchers.FirstOrDefaultAsync(v => v.Code == code);
            if (voucher == null) return (null, "Mã giảm giá không tồn tại.");
            if (!voucher.IsActive) return (null, "Mã giảm giá này đã bị vô hiệu hóa.");
            if (voucher.ExpiresAt.HasValue && voucher.ExpiresAt.Value < DateTime.UtcNow) return (null, "Mã giảm giá đã hết hạn.");
            if (voucher.UsageLimit.HasValue && voucher.UsedCount >= voucher.UsageLimit.Value) return (null, "Mã giảm giá đã hết lượt sử dụng.");
            if (orderAmount < voucher.MinOrderAmount) return (null, $"Đơn hàng cần tối thiểu {voucher.MinOrderAmount:N0}đ để áp dụng mã này.");

            return (voucher, null);
        }

        internal static decimal CalculateDiscount(Voucher voucher, decimal orderAmount)
        {
            decimal discount = voucher.DiscountType == "Percent"
                ? orderAmount * voucher.DiscountValue / 100m
                : voucher.DiscountValue;

            if (voucher.MaxDiscountAmount.HasValue && discount > voucher.MaxDiscountAmount.Value)
                discount = voucher.MaxDiscountAmount.Value;

            if (discount > orderAmount) discount = orderAmount;
            return Math.Round(discount, 0);
        }
    }
}
