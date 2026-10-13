using System.ComponentModel.DataAnnotations;

namespace ProductManagementAPI.Models
{
    public class Warranty
    {
        public int Id { get; set; }

        [Required, StringLength(30)]
        public string Code { get; set; } = string.Empty;

        public int OrderId { get; set; }
        public int OrderItemId { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsVoided { get; set; } = false;

        public OrderItem? OrderItem { get; set; }
        public Product? Product { get; set; }
    }
}