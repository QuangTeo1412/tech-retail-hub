namespace ProductManagementAPI.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);

        Task SendPaymentSuccessEmailAsync(string toEmail, int orderId, decimal totalAmount);
    }
}