namespace ProductManagementAPI.Models
{
    public class VerifyEmailDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class ResendVerificationDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
