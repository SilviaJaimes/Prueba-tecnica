using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JwtAuthApi.Models;
using JwtAuthApi.Repositories;

namespace JwtAuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repo;
    public ProductsController(IProductRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var product = await _repo.GetByIdAsync(id);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        var id = await _repo.CreateAsync(product);
        return CreatedAtAction(nameof(Get), new { id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Product body)
    {
        if (string.IsNullOrWhiteSpace(body.Name))
            return BadRequest("El campo 'name' es obligatorio.");

        var product = new Product
        {
            Id = id,
            Name = body.Name,
            Description = body.Description,
            Price = body.Price,
            CategoryId = body.CategoryId,
            SupplierId = body.SupplierId
        };

        var updated = await _repo.UpdateAsync(product);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
