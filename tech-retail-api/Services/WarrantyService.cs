using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Services
{
    public class WarrantyService
    {
        private const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        private readonly AppDbContext _context;

        public WarrantyService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<int> IssueForOrderAsync(Order order, DateTime startDate)
        {
            if (await _context.Warranties.AnyAsync(w => w.OrderId == order.Id))
                return 0;

            var usedCodes = new HashSet<string>();
            var created = 0;

            foreach (var item in order.OrderItems)
            {
                var months = item.Product?.WarrantyMonths ?? 0;
                if (months <= 0) continue;

                for (int i = 0; i < item.Quantity; i++)
                {
                    var code = await GenerateUniqueCodeAsync(startDate, usedCodes);

                    _context.Warranties.Add(new Warranty
                    {
                        Code = code,
                        OrderId = order.Id,
                        OrderItemId = item.Id,
                        ProductId = item.ProductId,
                        UserId = order.UserId,
                        StartDate = startDate,
                        EndDate = startDate.AddMonths(months)
                    });
                    created++;
                }
            }

            return created;
        }

        private async Task<string> GenerateUniqueCodeAsync(DateTime date, HashSet<string> used)
        {
            string code;
            do
            {
                code = $"BH-{date:yyyyMMdd}-{RandomSuffix(6)}";
            }
            while (!used.Add(code) || await _context.Warranties.AnyAsync(w => w.Code == code));

            return code;
        }

        private static string RandomSuffix(int length)
        {
            var chars = new char[length];
            for (int i = 0; i < length; i++)
                chars[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
            return new string(chars);
        }
    }
}