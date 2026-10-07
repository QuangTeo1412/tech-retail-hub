using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementAPI.Models
{
    public class Voucher
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mã giảm giá")]
        [StringLength(30)]
        public string Code { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "Percent";

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscountAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderAmount { get; set; } = 0;

        public DateTime? ExpiresAt { get; set; }

        public int? UsageLimit { get; set; }
        public int UsedCount { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
