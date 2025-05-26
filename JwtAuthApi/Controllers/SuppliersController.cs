using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JwtAuthApi.Models;
using JwtAuthApi.Repositories;

namespace JwtAuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly ISupplierRepository _repo;
    public SuppliersController(ISupplierRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Supplier model)
    {
        var id = await _repo.CreateAsync(model);
        return CreatedAtAction(nameof(Get), new { id }, model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Supplier body)
    {
        if (string.IsNullOrWhiteSpace(body.Name))
            return BadRequest("El campo 'name' es obligatorio.");

        var supplier = new Supplier
        {
            Id = id,
            Name = body.Name,
            Contact = body.Contact
        };

        var updated = await _repo.UpdateAsync(supplier);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
