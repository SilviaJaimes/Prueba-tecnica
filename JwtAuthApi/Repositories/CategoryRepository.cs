using Dapper;
using Npgsql;
using JwtAuthApi.Models;

namespace JwtAuthApi.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IConfiguration _config;
    public CategoryRepository(IConfiguration config) => _config = config;

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryAsync<Category>("SELECT * FROM categories");
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.QueryFirstOrDefaultAsync<Category>("SELECT * FROM categories WHERE id = @id", new { id });
    }

    public async Task<int> CreateAsync(Category category)
    {
        const string sql = "INSERT INTO categories (name) VALUES (@Name) RETURNING id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteScalarAsync<int>(sql, category);
    }

    public async Task<bool> UpdateAsync(Category category)
    {
        const string sql = "UPDATE categories SET name = @Name WHERE id = @Id";
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync(sql, category) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        return await conn.ExecuteAsync("DELETE FROM categories WHERE id = @id", new { id }) > 0;
    }
}
