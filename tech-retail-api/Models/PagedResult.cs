namespace ProductManagementAPI.Models
{
    public class PagedResult<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)(PageSize > 0 ? PageSize : 10));

        public PagedResult() { }

        public PagedResult(List<T> data, int totalItems, int pageNumber, int pageSize)
        {
            Data = data;
            TotalItems = totalItems;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}