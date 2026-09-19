using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            string identifier = request.UsernameOrEmail?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Email/SĐT/Username và Mật khẩu!" });
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

            var jwtToken = GenerateJwtToken(user);

            return Ok(new
            {
                token = jwtToken,
                user = new
                {
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
            var secretKey = _configuration["JwtSettings:SecretKey"] ?? "DefaultFallbackSecretKeyMustBeLongEnough12345!";
            var issuer = _configuration["JwtSettings:Issuer"] ?? "ProductManagementAPI";
            var audience = _configuration["JwtSettings:Audience"] ?? "ProductManagementClient";
            var expireMinutes = double.TryParse(_configuration["JwtSettings:ExpireMinutes"], out var mins) ? mins : 60;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username ?? user.Email ?? "user"),
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
                Role = "User"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng ký tài khoản thành công!",
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
        public string Password { get; set; } = string.Empty;
        public string? ConfirmPassword { get; set; }
    }
}