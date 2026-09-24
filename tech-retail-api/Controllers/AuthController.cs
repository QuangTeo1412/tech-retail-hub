using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductManagementAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Net;
using Microsoft.AspNetCore.WebUtilities;
using ProductManagementAPI.Services;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            string identifier = request.UsernameOrEmail?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Email/SĐT và Mật khẩu!" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == identifier ||
                u.Email == identifier ||
                u.PhoneNumber == identifier);

            if (user == null)
            {
                return BadRequest(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            bool isPasswordValid;

            if (!string.IsNullOrEmpty(user.PasswordHash) && (user.PasswordHash.StartsWith("$2a$") || user.PasswordHash.StartsWith("$2b$")))
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            }
            else
            {
                isPasswordValid = user.PasswordHash == request.Password;
            }

            if (!isPasswordValid)
            {
                return BadRequest(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            if (!user.EmailConfirmed)
            {
                return BadRequest(new
                {
                    message = "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư hoặc gửi lại email xác nhận.",
                    code = "EMAIL_NOT_CONFIRMED"
                });
            }


            var jwtToken = GenerateJwtToken(user);

            return Ok(new
            {
                token = jwtToken,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    fullName = user.FullName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    role = user.Role
                }
            });
        }

        private string GenerateJwtToken(User user)
        {

            var secretKey = _configuration["JwtSettings:SecretKey"]
                         ?? _configuration["AppSettings:Token"]
                         ?? "DefaultFallbackSecretKeyMustBeLongEnough12345!";
            var issuer = _configuration["JwtSettings:Issuer"] ?? "ProductManagementAPI";
            var audience = _configuration["JwtSettings:Audience"] ?? "ProductManagementClient";
            var expireMinutes = double.TryParse(_configuration["JwtSettings:ExpireMinutes"], out var mins) ? mins : 60;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),

                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("userId", user.Id.ToString()),

                new Claim(ClaimTypes.Name, user.Username ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            string email = request.Email?.Trim() ?? string.Empty;
            string phone = request.PhoneNumber?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(phone) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Email, Số điện thoại và Mật khẩu!" });
            }

            if (!new EmailAddressAttribute().IsValid(email))
            {
                return BadRequest(new { message = "Địa chỉ Email không hợp lệ!" });
            }

            if (request.ConfirmPassword != null && request.ConfirmPassword != request.Password)
            {
                return BadRequest(new { message = "Mật khẩu xác nhận không khớp!" });
            }

            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return BadRequest(new { message = "Địa chỉ Email này đã được đăng ký!" });
            }

            if (await _context.Users.AnyAsync(u => u.PhoneNumber == phone))
            {
                return BadRequest(new { message = "Số điện thoại này đã được đăng ký!" });
            }

            string username = await GenerateUniqueUsernameAsync(email);
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Email = email,
                PhoneNumber = phone,
                PasswordHash = passwordHash,
                Username = username,
                FullName = string.Empty,
                Role = "User",
                EmailConfirmed = false,
                EmailVerificationToken = GenerateToken(),
                EmailVerificationTokenExpires = DateTime.UtcNow.AddHours(24)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            await SendVerificationEmailAsync(newUser);

            return Ok(new
            {
                message = "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập.",
                user = new { newUser.Username, newUser.Email, newUser.PhoneNumber, newUser.Role }
            });

        }

        private async Task<string> GenerateUniqueUsernameAsync(string email)
        {
            string local = email.Split('@')[0].ToLowerInvariant();
            string baseName = new string(local
                .Where(c => (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '.' || c == '_' || c == '-')
                .ToArray());

            if (string.IsNullOrEmpty(baseName))
            {
                baseName = "user";
            }

            string candidate = baseName;
            int suffix = 1;

            while (await _context.Users.AnyAsync(u => u.Username == candidate))
            {
                candidate = $"{baseName}{suffix}";
                suffix++;
            }

            return candidate;
        }
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto request)
        {
            var token = request.Token?.Trim();
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new { message = "Thiếu mã xác nhận." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
            if (user == null)
            {
                return BadRequest(new { message = "Mã xác nhận không hợp lệ." });
            }

            if (user.EmailConfirmed)
            {
                return Ok(new { message = "Email này đã được xác nhận trước đó, bạn có thể đăng nhập." });
            }

            if (user.EmailVerificationTokenExpires == null || user.EmailVerificationTokenExpires < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Mã xác nhận đã hết hạn, vui lòng bấm \"Gửi lại email xác nhận\"." });
            }

            user.EmailConfirmed = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpires = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xác nhận email thành công! Bạn có thể đăng nhập ngay bây giờ." });
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationDto request)
        {
            var email = request.Email?.Trim() ?? string.Empty;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user != null && !user.EmailConfirmed)
            {
                user.EmailVerificationToken = GenerateToken();
                user.EmailVerificationTokenExpires = DateTime.UtcNow.AddHours(24);
                await _context.SaveChangesAsync();
                await SendVerificationEmailAsync(user);
            }

            return Ok(new { message = "Hệ thống đã gửi lại thư xác nhận, vui lòng kiểm tra email của bạn." });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            var email = request.Email?.Trim() ?? string.Empty;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user != null)
            {
                user.PasswordResetToken = GenerateToken();
                user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);
                await _context.SaveChangesAsync();
                await SendPasswordResetEmailAsync(user);
            }

            return Ok(new { message = "Hệ thống đã gửi hướng dẫn đặt lại mật khẩu, vui lòng kiểm tra email của bạn." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            var token = request.Token?.Trim();
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new { message = "Thiếu mã đặt lại mật khẩu." });
            }
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 8 ký tự." });
            }
            if (request.ConfirmPassword != request.NewPassword)
            {
                return BadRequest(new { message = "Mật khẩu xác nhận không khớp." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);
            if (user == null)
            {
                return BadRequest(new { message = "Mã đặt lại mật khẩu không hợp lệ." });
            }

            if (user.PasswordResetTokenExpires == null || user.PasswordResetTokenExpires < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Mã đặt lại mật khẩu đã hết hạn, vui lòng yêu cầu lại." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới." });
        }

        private static string GenerateToken()
        {
            var bytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(32);
            return WebEncoders.Base64UrlEncode(bytes);
        }

        private async Task SendVerificationEmailAsync(User user)
        {
            var baseUrl = _configuration["App:FrontendBaseUrl"] ?? "http://localhost:3000";
            var link = $"{baseUrl}/verify-email?token={user.EmailVerificationToken}";
            var body = $@"<p>Xin chào {WebUtility.HtmlEncode(user.Username)},</p>
                <p>Vui lòng bấm vào liên kết bên dưới để xác nhận email và kích hoạt tài khoản KAITO STORE (liên kết có hiệu lực 24 giờ):</p>
                <p><a href=""{link}"">{link}</a></p>";

            try
            {
                await _emailService.SendEmailAsync(user.Email, "Xác nhận email - KAITO STORE", body);
                Console.WriteLine($"[SendEmail] Đã gửi email xác nhận tới {user.Email}");
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"[SendEmail] LỖI gửi email xác nhận tới {user.Email}: {ex}");
            }
        }

        private async Task SendPasswordResetEmailAsync(User user)
        {
            var baseUrl = _configuration["App:FrontendBaseUrl"] ?? "http://localhost:3000";
            var link = $"{baseUrl}/reset-password?token={user.PasswordResetToken}";
            var body = $@"<p>Xin chào {WebUtility.HtmlEncode(user.Username)},</p>
                <p>Bạn (hoặc ai đó) vừa yêu cầu đặt lại mật khẩu cho tài khoản KAITO STORE. Liên kết có hiệu lực trong 1 giờ:</p>
                <p><a href=""{link}"">{link}</a></p>
                <p>Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>";

            try
            {
                await _emailService.SendEmailAsync(user.Email, "Đặt lại mật khẩu - KAITO STORE", body);
                Console.WriteLine($"[SendEmail] Đã gửi email reset mật khẩu tới {user.Email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SendEmail] LỖI gửi email reset mật khẩu tới {user.Email}: {ex}");
            }
        }

    }

    public class LoginDto
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        [JsonPropertyName("phone")]
        public string? PhoneAlias { set { if (string.IsNullOrEmpty(PhoneNumber)) PhoneNumber = value ?? string.Empty; } }
        public string Password { get; set; } = string.Empty;
        public string? ConfirmPassword { get; set; }
    }
}