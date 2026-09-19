using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            string inputIdentifier = request.UsernameOrEmail ?? request.Username;

            if (string.IsNullOrWhiteSpace(inputIdentifier) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Email/SĐT/Username và Mật khẩu!" });
            }

            inputIdentifier = inputIdentifier.Trim();

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == inputIdentifier ||
                u.Email == inputIdentifier ||
                u.PhoneNumber == inputIdentifier);

            if (user == null)
            {
                return BadRequest(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
            }

            bool isPasswordValid = false;

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

            return Ok(new
            {
                token = "mock-jwt-token-123456",
                username = user.Username,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                role = user.Role
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin!" });
            }

            var usernameExists = await _context.Users.AnyAsync(u => u.Username == request.Username.Trim());
            if (usernameExists)
            {
                return BadRequest(new { message = "Tên đăng nhập này đã tồn tại!" });
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email.Trim());
                if (emailExists)
                {
                    return BadRequest(new { message = "Địa chỉ Email này đã được đăng ký!" });
                }
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                var phoneExists = await _context.Users.AnyAsync(u => u.PhoneNumber == request.PhoneNumber.Trim());
                if (phoneExists)
                {
                    return BadRequest(new { message = "Số điện thoại này đã được đăng ký!" });
                }
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username.Trim(),
                PasswordHash = hashedPassword,
                FullName = request.FullName?.Trim() ?? string.Empty,
                Email = request.Email?.Trim() ?? string.Empty,
                PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty,
                Role = "Customer"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }
    }

    public class LoginDto
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}