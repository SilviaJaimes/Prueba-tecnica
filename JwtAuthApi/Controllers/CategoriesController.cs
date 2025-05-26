using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JwtAuthApi.Models;
using JwtAuthApi.Repositories;

namespace JwtAuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _repo;
    public CategoriesController(ICategoryRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Category model)
    {
        var id = await _repo.CreateAsync(model);
        return CreatedAtAction(nameof(Get), new { id }, model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Dictionary<string, string> body)
    {
        if (!body.TryGetValue("name", out var name) || string.IsNullOrWhiteSpace(name))
            return BadRequest("El campo 'name' es obligatorio.");

        var category = new Category { Id = id, Name = name };
        var updated = await _repo.UpdateAsync(category);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
