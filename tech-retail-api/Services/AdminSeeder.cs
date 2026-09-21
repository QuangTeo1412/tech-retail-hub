using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Services
{
    public static class AdminSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            if (await context.Users.AnyAsync(u => u.Role == Roles.Admin)) return;

            var email = config["SeedAdmin:Email"]?.Trim();
            var password = config["SeedAdmin:Password"];
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password)) return;

            var existing = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existing != null)
            {
                existing.Role = Roles.Admin;
            }
            else
            {
                var username = await context.Users.AnyAsync(u => u.Username == "admin") ? "admin-seed" : "admin";
                context.Users.Add(new User
                {
                    Username = username,
                    FullName = "Quản trị viên",
                    Email = email,
                    PhoneNumber = config["SeedAdmin:PhoneNumber"] ?? "0900000000",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                    Role = Roles.Admin
                });
            }

            await context.SaveChangesAsync();
        }
    }
}