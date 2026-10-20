using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst("userId")?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst("sub")?.Value;

            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(u =>
                    u.Username.ToLower().Contains(s) ||
                    u.Email.ToLower().Contains(s) ||
                    u.PhoneNumber.Contains(s));
            }

            var users = await query
                .OrderByDescending(u => u.Id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.PhoneNumber,
                    u.Role,
                    u.IsLocked,
                    u.EmailConfirmed
                })
                .ToListAsync();

            return Ok(users);
        }

        public class UpdateLockRequest
        {
            public bool IsLocked { get; set; }
        }

        [HttpPut("{id:int}/lock")]
        public async Task<IActionResult> SetLocked(int id, [FromBody] UpdateLockRequest request)
        {
            var currentUserId = GetUserIdFromToken();
            if (id == currentUserId)
            {
                return BadRequest(new { message = "Không thể tự khóa tài khoản của chính mình." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            if (request.IsLocked && user.Role == "Admin")
            {
                var otherActiveAdmins = await _context.Users
                    .CountAsync(u => u.Role == "Admin" && !u.IsLocked && u.Id != id);

                if (otherActiveAdmins == 0)
                {
                    return BadRequest(new { message = "Không thể khóa Admin cuối cùng còn hoạt động." });
                }
            }

            user.IsLocked = request.IsLocked;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = user.IsLocked ? "Đã khóa tài khoản." : "Đã mở khóa tài khoản.",
                id = user.Id,
                isLocked = user.IsLocked
            });
        }

        public class UpdateRoleRequest
        {
            public string Role { get; set; } = string.Empty;
        }

        [HttpPut("{id:int}/role")]
        public async Task<IActionResult> SetRole(int id, [FromBody] UpdateRoleRequest request)
        {
            if (request.Role != "Admin" && request.Role != "User")
            {
                return BadRequest(new { message = "Role chỉ nhận 'Admin' hoặc 'User'." });
            }

            var currentUserId = GetUserIdFromToken();
            if (id == currentUserId && request.Role != "Admin")
            {
                return BadRequest(new { message = "Không thể tự bỏ quyền Admin của chính mình." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            if (user.Role == "Admin" && request.Role == "User")
            {
                var otherAdmins = await _context.Users.CountAsync(u => u.Role == "Admin" && u.Id != id);
                if (otherAdmins == 0)
                {
                    return BadRequest(new { message = "Không thể bỏ quyền của Admin cuối cùng còn lại." });
                }
            }

            user.Role = request.Role;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Đã đổi quyền thành '{request.Role}'.",
                id = user.Id,
                role = user.Role
            });
        }
    }
}
