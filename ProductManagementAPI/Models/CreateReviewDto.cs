using System.ComponentModel.DataAnnotations;

namespace ProductManagementAPI.Models
{
    public class CreateReviewDto
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, 5, ErrorMessage = "Đánh giá từ 1 đến 5 sao.")]
        public int Rating { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập bình luận.")]
        public string Comment { get; set; } = string.Empty;
    }
}