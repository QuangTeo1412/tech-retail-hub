using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(productParams.Search))
            {
                var searchLower = productParams.Search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchLower));
            }

            if (!string.IsNullOrWhiteSpace(productParams.Category))
            {
                query = query.Where(p => p.Category == productParams.Category);
            }

            if (productParams.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= productParams.MinPrice.Value);
            }
            if (productParams.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= productParams.MaxPrice.Value);
            }

            query = productParams.SortBy switch
            {
                "priceAsc" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                "name" => query.OrderBy(p => p.Name),
                _ => query.OrderByDescending(p => p.Id)
            };

            var totalItems = await query.CountAsync();
            var products = await query
                .Skip((productParams.PageNumber - 1) * productParams.PageSize)
                .Take(productParams.PageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                PageNumber = productParams.PageNumber,
                PageSize = productParams.PageSize,
                TotalPages = (int)Math.Ceiling(totalItems / (double)productParams.PageSize),
                Data = products
            });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Không tìm thấy sản phẩm này!");
            }

            return product;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest("ID không trùng khớp!");
            }

            _context.Entry(product).State = EntityState.Modified;
            _context.Entry(product).Property(p => p.CreatedAt).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpPut("{id:int}/image")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SetImage(int id, [FromBody] SetImageRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này!" });
            }

            var imageUrl = request.ImageUrl?.Trim() ?? string.Empty;
            if (imageUrl.Length > 0 && !IsValidImageUrl(imageUrl))
            {
                return BadRequest(new { message = "Đường dẫn ảnh không hợp lệ. Dùng dạng /uploads/ten-file.jpg hoặc link bắt đầu bằng http(s)://" });
            }

            product.ImageUrl = imageUrl;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã cập nhật ảnh sản phẩm.", imageUrl = product.ImageUrl });
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict(new { message = "Sản phẩm đã có trong giỏ hàng hoặc đơn hàng nên không thể xóa. Bạn có thể đặt tồn kho về 0 để ngừng bán." });
            }

            return NoContent();
        }

        private static bool IsValidsImageUrl(string url)
        {
            if (url.StartsWith("/uploads/", StringComparison.Ordinal))
            {
                return !url.Contains("..");
            }

            return Uri.TryCreate(url, UriKind.Absolute, out var uri)
                   && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }
        private static bool IsValidImageUrl(string url)
        {
            if (url.StartsWith("/uploads/", StringComparison.Ordinal))
            {
                return !url.Contains("..");
            }

            return Uri.TryCreate(url, UriKind.Absolute, out var uri)
                   && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }
    }

    public class SetImageRequest
    {
        public string ImageUrl { get; set; } = string.Empty;
    }
}