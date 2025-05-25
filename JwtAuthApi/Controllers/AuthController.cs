using Microsoft.AspNetCore.Mvc;
using JwtAuthApi.Repositories;
using JwtAuthApi.Services;
using JwtAuthApi.Models;

namespace JwtAuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly TokenService _tokenService;

    public AuthController(IUserRepository userRepository, TokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User login)
    {
        var user = await _userRepository.GetUserAsync(login.Email, login.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var token = _tokenService.CreateToken(user);
        return Ok(new { token });
    }
}
