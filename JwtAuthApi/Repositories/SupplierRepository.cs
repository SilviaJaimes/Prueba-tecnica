using Dapper;
using Npgsql;
using JwtAuthApi.Models;

namespace JwtAuthApi.Repositories;

public class SupplierRepository : ISupplierRepository
{
    private readonly IConfiguration _config;
    public SupplierRepository(IConfiguration config) => _config = config;

    public async Task<IEnumerable<Supplier>> GetAllAsync()
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryAsync<Supplier>("SELECT * FROM suppliers");
    }

    public async Task<Supplier?> GetByIdAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryFirstOrDefaultAsync<Supplier>("SELECT * FROM suppliers WHERE id = @id", new { id });
    }

    public async Task<int> CreateAsync(Supplier supplier)
    {
        const string sql = "INSERT INTO suppliers (name, contact) VALUES (@Name, @Contact) RETURNING id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteScalarAsync<int>(sql, supplier);
    }

    public async Task<bool> UpdateAsync(Supplier supplier)
    {
        const string sql = "UPDATE suppliers SET name = @Name, contact = @Contact WHERE id = @Id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync(sql, supplier) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync("DELETE FROM suppliers WHERE id = @id", new { id }) > 0;
    }
}
