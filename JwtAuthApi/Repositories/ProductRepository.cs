using Dapper;
using Npgsql;
using JwtAuthApi.Models;

namespace JwtAuthApi.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IConfiguration _config;
    public ProductRepository(IConfiguration config) => _config = config;

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryAsync<Product>("SELECT * FROM products");
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryFirstOrDefaultAsync<Product>("SELECT * FROM products WHERE id = @id", new { id });
    }

    public async Task<int> CreateAsync(Product product)
    {
        const string sql = @"INSERT INTO products (name, price, description, categoryId, supplier_id)
                             VALUES (@Name, @Price, @Description, @CategoryId, @SupplierId) RETURNING id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteScalarAsync<int>(sql, product);
    }

    public async Task<bool> UpdateAsync(Product product)
    {
        const string sql = @"UPDATE products SET name=@Name, price=@Price, description=@Description,
                            categoryId=@CategoryId, supplier_id=@SupplierId WHERE id=@Id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync(sql, product) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync("DELETE FROM products WHERE id = @id", new { id }) > 0;
    }
}
