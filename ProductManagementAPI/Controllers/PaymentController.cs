    using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Services;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public PaymentController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost("create-vnpay-url/{orderId}")]
        public async Task<IActionResult> CreatePaymentUrl(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound("Không tìm thấy đơn hàng.");

            var vnpay = new VnPayLibrary();
            var vnpSection = _config.GetSection("VnPay");

            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneInfo);

            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnpSection["TmnCode"]!);
            vnpay.AddRequestData("vnp_Amount", ((long)(order.TotalAmount * 100)).ToString());
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_ExpireDate", timeNow.AddMinutes(15).ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", "127.0.0.1");
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", $"ThanhToanDonHang{order.Id}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", vnpSection["ReturnUrl"]!);
            vnpay.AddRequestData("vnp_TxnRef", order.Id.ToString());

            string paymentUrl = vnpay.CreateRequestUrl(vnpSection["BaseUrl"]!, vnpSection["HashSecret"]!);

            return Ok(new { PaymentUrl = paymentUrl });
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn([FromQuery] string vnp_ResponseCode, [FromQuery] string vnp_TxnRef)
        {
            if (vnp_ResponseCode == "00") 
            {
                int orderId = int.Parse(vnp_TxnRef);
                var order = await _context.Orders.FindAsync(orderId);
                if (order != null)
                {
                    order.Status = "Processing"; 
                    await _context.SaveChangesAsync();
                }

                return Ok(new { Message = $"Thanh toán thành công cho đơn hàng #{vnp_TxnRef}!" });
            }

            return BadRequest(new { Message = "Thanh toán thất bại hoặc đã bị hủy." });
        }
    }
}