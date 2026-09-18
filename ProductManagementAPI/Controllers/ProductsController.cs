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

            // 1. Tìm kiếm theo tên
            if (!string.IsNullOrWhiteSpace(productParams.Search))
            {
                var searchLower = productParams.Search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchLower));
            }

            // 2. Lọc theo Danh mục
            if (!string.IsNullOrWhiteSpace(productParams.Category))
            {
                query = query.Where(p => p.Category == productParams.Category);
            }

            // 3. Lọc theo Khoảng giá
            if (productParams.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= productParams.MinPrice.Value);
            }
            if (productParams.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= productParams.MaxPrice.Value);
            }

            // 4. Sắp xếp
            query = productParams.SortBy switch
            {
                "priceAsc" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                "name" => query.OrderBy(p => p.Name),
                _ => query.OrderByDescending(p => p.Id)
            };

            // 5. Phân trang (Pagination)
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

        [HttpGet("{id}")]
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
        [Authorize]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest("ID không trùng khớp!");
            }

            _context.Entry(product).State = EntityState.Modified;

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

        [HttpDelete("{id}")]
        [Authorize]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}