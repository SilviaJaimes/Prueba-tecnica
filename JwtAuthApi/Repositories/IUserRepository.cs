using JwtAuthApi.Models;

namespace JwtAuthApi.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserAsync(string email, string password);
}
