namespace ProductManagementAPI.Models
{
    // Dùng đúng giá trị đang có trong database ("User" do Register gán, "Admin" cho quản trị).
    // Dùng const (không dùng enum) để gắn được vào attribute: [Authorize(Roles = Roles.Admin)]
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string User = "User";
    }
}