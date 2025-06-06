using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JwtAuthApi.Models;
using JwtAuthApi.Repositories;

namespace JwtAuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository _repo;
    public OrdersController(IOrderRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Order model)
    {
        var id = await _repo.CreateAsync(model);
        return CreatedAtAction(nameof(Get), new { id }, model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Order body)
    {
        if (body.ProductId <= 0 || body.Quantity <= 0 || body.TotalPrice <= 0)
            return BadRequest("Todos los campos deben ser válidos.");

        var order = new Order
        {
            Id = id,
            ProductId = body.ProductId,
            Quantity = body.Quantity,
            TotalPrice = body.TotalPrice
        };

        var updated = await _repo.UpdateAsync(order);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
