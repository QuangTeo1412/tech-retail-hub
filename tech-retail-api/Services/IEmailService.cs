namespace ProductManagementAPI.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationEmailAsync(string toEmail, int orderId, decimal totalAmount);
    }
}