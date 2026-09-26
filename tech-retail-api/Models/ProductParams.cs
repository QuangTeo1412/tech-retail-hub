namespace ProductManagementAPI.Models
{
    public class ProductParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string? Search { get; set; }
        public string? Category { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SortBy { get; set; }
        public string? Brand { get; set; }
        public string? Ram { get; set; }
        public string? Gpu { get; set; }
    }
}