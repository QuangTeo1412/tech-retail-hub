using MailKit.Net.Smtp;
using MimeKit;

namespace ProductManagementAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOrderConfirmationEmailAsync(string toEmail, int orderId, decimal totalAmount)
        {
            string subject = $"[Kaito Store] Xác nhận đơn hàng #{orderId} thành công!";
            string htmlBody = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <h2 style='color: #d70018;'>Cảm ơn bạn đã đặt hàng tại Kaito Store!</h2>
                        <p>Đơn hàng <b>#{orderId}</b> của bạn đã được ghi nhận thành công.</p>
                        <p>Tổng tiền thanh toán: <b style='color: #d70018;'>{totalAmount:N0} VNĐ</b></p>
                        <p>Đơn hàng sẽ sớm được xử lý và giao tới bạn.</p>
                    </div>";

            await SendAsync(toEmail, subject, htmlBody);
        }

        public async Task SendPaymentSuccessEmailAsync(string toEmail, int orderId, decimal totalAmount)
        {
            string subject = $"[Kaito Store] Thanh toán thành công đơn hàng #{orderId}";
            string htmlBody = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <h2 style='color: #16a34a;'>Thanh toán thành công!</h2>
                        <p>Kaito Store đã nhận được thanh toán cho đơn hàng <b>#{orderId}</b>.</p>
                        <p>Số tiền đã thanh toán: <b style='color: #16a34a;'>{totalAmount:N0} VNĐ</b></p>
                        <p>Đơn hàng sẽ sớm được xử lý và giao tới bạn. Cảm ơn bạn đã mua sắm tại Kaito Store!</p>
                    </div>";

            await SendAsync(toEmail, subject, htmlBody);
        }

        private async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            var emailSettings = _config.GetSection("EmailSettings");
            string smtpServer = emailSettings["SmtpServer"] ?? "smtp.gmail.com";
            int smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            string senderEmail = emailSettings["SenderEmail"] ?? "";
            string senderName = emailSettings["SenderName"] ?? "Kaito Store";
            string appPassword = emailSettings["AppPassword"] ?? "";

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, appPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}