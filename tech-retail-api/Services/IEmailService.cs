namespace ProductManagementAPI.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);

        Task SendOrderConfirmationEmailAsync(string toEmail, int orderId, decimal totalAmount);

        Task SendPaymentSuccessEmailAsync(string toEmail, int orderId, decimal totalAmount);
    }
}