using Dapper;
using Npgsql;
using JwtAuthApi.Models;

namespace JwtAuthApi.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IConfiguration _configuration;

    public UserRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<User?> GetUserAsync(string email, string password)
    {
        const string query = "SELECT * FROM users WHERE email = @Email AND password = @Password";

        using var connection = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        var user = await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email, Password = password });

        return user;
    }
}
