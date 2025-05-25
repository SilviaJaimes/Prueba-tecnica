using Dapper;
using Npgsql;
using JwtAuthApi.Models;

namespace JwtAuthApi.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly IConfiguration _config;
    public OrderRepository(IConfiguration config) => _config = config;

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryAsync<Order>("SELECT * FROM orders");
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryFirstOrDefaultAsync<Order>("SELECT * FROM orders WHERE id = @id", new { id });
    }

    public async Task<int> CreateAsync(Order order)
    {
        const string sql = @"INSERT INTO orders (product_id, quantity, total_price)
                             VALUES (@ProductId, @Quantity, @TotalPrice) RETURNING id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteScalarAsync<int>(sql, order);
    }

    public async Task<bool> UpdateAsync(Order order)
    {
        const string sql = @"UPDATE orders SET product_id = @ProductId, quantity = @Quantity,
                             total_price = @TotalPrice WHERE id = @Id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync(sql, order) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync("DELETE FROM orders WHERE id = @id", new { id }) > 0;
    }
}
