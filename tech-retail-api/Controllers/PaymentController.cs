using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Models;
using ProductManagementAPI.Services;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(
            IConfiguration config,
            AppDbContext context,
            IEmailService emailService,
            ILogger<PaymentController> logger)
        {
            _config = config;
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("create-vnpay-url/{orderId}")]
        public async Task<IActionResult> CreatePaymentUrl(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound("Không tìm thấy đơn hàng.");

            var vnpay = new VnPayLibrary();
            var vnpSection = _config.GetSection("VnPay");

            var timeNow = DateTime.UtcNow.AddHours(7);

            var remoteIp = HttpContext.Connection.RemoteIpAddress;
            string ipAddr = remoteIp == null || IPAddress.IsLoopback(remoteIp)
                ? "127.0.0.1"
                : (remoteIp.IsIPv4MappedToIPv6 ? remoteIp.MapToIPv4().ToString() : remoteIp.ToString());

            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnpSection["TmnCode"]!);
            vnpay.AddRequestData("vnp_Amount", ((long)(order.TotalAmount * 100)).ToString());
            vnpay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_ExpireDate", timeNow.AddMinutes(15).ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", ipAddr);
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
            string hashSecret = _config.GetSection("VnPay")["HashSecret"]!;
            if (!IsValidVnPaySignature(Request.Query, hashSecret))
            {
                _logger.LogWarning("VNPay return: chữ ký không hợp lệ, TxnRef={TxnRef}", vnp_TxnRef);
                return BadRequest(new { Message = "Chữ ký không hợp lệ." });
            }

            if (!int.TryParse(vnp_TxnRef, out int orderId))
            {
                return BadRequest(new { Message = "Mã đơn hàng không hợp lệ." });
            }

            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound(new { Message = "Không tìm thấy đơn hàng." });
            }

            string amountText = Request.Query["vnp_Amount"].ToString();
            if (long.TryParse(amountText, out long paidAmount) && paidAmount != (long)(order.TotalAmount * 100))
            {
                _logger.LogWarning("VNPay return: sai số tiền đơn {OrderId} ({Paid} != {Expected})",
                    orderId, paidAmount, (long)(order.TotalAmount * 100));
                return BadRequest(new { Message = "Số tiền thanh toán không khớp với đơn hàng." });
            }

            string transactionStatus = Request.Query["vnp_TransactionStatus"].ToString();
            bool isSuccess = vnp_ResponseCode == "00" &&
                             (string.IsNullOrEmpty(transactionStatus) || transactionStatus == "00");

            if (!isSuccess)
            {
                return BadRequest(new { Message = "Thanh toán thất bại hoặc đã bị hủy." });
            }

            if (order.Status != "Processing")
            {
                order.Status = "Processing";
                await _context.SaveChangesAsync();

                await SendPaymentSuccessEmailAsync(order);
            }

            return Ok(new { Message = $"Thanh toán thành công cho đơn hàng #{vnp_TxnRef}!" });
        }

        private async Task SendPaymentSuccessEmailAsync(Order order)
        {
            try
            {
                var user = await _context.Users.FindAsync(order.UserId);
                if (user == null || string.IsNullOrWhiteSpace(user.Email))
                {
                    _logger.LogWarning("Không gửi email cho đơn {OrderId}: không tìm thấy email người dùng.", order.Id);
                    return;
                }

                await _emailService.SendOrderConfirmationEmailAsync(user.Email, order.Id, order.TotalAmount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gửi email xác nhận cho đơn {OrderId} thất bại.", order.Id);
            }
        }

        private static bool IsValidVnPaySignature(IQueryCollection query, string hashSecret)
        {
            string receivedHash = query["vnp_SecureHash"].ToString();
            if (string.IsNullOrEmpty(receivedHash)) return false;

            var data = new SortedDictionary<string, string>(StringComparer.Ordinal);
            foreach (var kv in query)
            {
                string value = kv.Value.ToString();
                if (kv.Key.StartsWith("vnp_") &&
                    kv.Key != "vnp_SecureHash" &&
                    kv.Key != "vnp_SecureHashType" &&
                    !string.IsNullOrEmpty(value))
                {
                    data[kv.Key] = value;
                }
            }

            string signData = string.Join("&",
                data.Select(kv => $"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}"));

            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(hashSecret));
            string computedHash = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(signData))).ToLowerInvariant();

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(computedHash),
                Encoding.UTF8.GetBytes(receivedHash.ToLowerInvariant()));
        }
    }
}