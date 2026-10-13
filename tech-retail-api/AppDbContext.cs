using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;

namespace ProductManagementAPI
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<Warranty> Warranties { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<OrderItem>().Property(o => o.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Product>().Property(p => p.WarrantyMonths).HasDefaultValue(12);

            modelBuilder.Entity<Warranty>(e =>
            {
                e.HasIndex(w => w.Code).IsUnique();
                e.HasIndex(w => w.OrderId);
                e.HasIndex(w => w.UserId);
                e.HasOne(w => w.OrderItem).WithMany().HasForeignKey(w => w.OrderItemId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(w => w.Product).WithMany().HasForeignKey(w => w.ProductId).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}