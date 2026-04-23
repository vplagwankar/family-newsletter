using FamilyNewsletter.Api.Data;
using FamilyNewsletter.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/members")]
public class MembersController(DataStore store) : ControllerBase
{
    // ── Public endpoints ──────────────────────────────────────────────────────

    /// <summary>All active (non-deleted) family members.</summary>
    [HttpGet]
    public IActionResult GetAll()
    {
        var result = store.Members.Where(m => !m.Deleted).ToList();
        return Ok(result);
    }

    /// <summary>A random living member for the Family Spotlight section.</summary>
    [HttpGet("spotlight")]
    public IActionResult GetSpotlight()
    {
        var living = store.Members.Where(m => !m.IsDeceased && !m.Deleted).ToList();
        if (living.Count == 0) return NotFound();
        var member = living[Random.Shared.Next(living.Count)];
        return Ok(member);
    }

    /// <summary>Members with birthdays in the current month.</summary>
    [HttpGet("birthdays")]
    public IActionResult GetBirthdays()
    {
        var month = DateTime.UtcNow.Month;
        var result = store.Members
            .Where(m =>
            {
                if (m.Dob is null || m.IsDeceased || m.Deleted) return false;
                var parts = m.Dob.Split('-');
                return parts.Length >= 2 && int.TryParse(parts[1], out var mm) && mm == month;
            })
            .ToList();
        return Ok(result);
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    /// <summary>All members including soft-deleted — for the admin panel.</summary>
    [Authorize]
    [HttpGet("admin")]
    public IActionResult GetAdmin()
    {
        return Ok(store.Members.ToList());
    }

    /// <summary>Create a new family member.</summary>
    [Authorize]
    [HttpPost]
    public IActionResult Create([FromBody] FamilyMember data)
    {
        var created = store.CreateMember(data);
        return Created($"/api/members/{created.Id}", created);
    }

    /// <summary>Update a family member.</summary>
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] FamilyMember patch)
    {
        var updated = store.UpdateMember(id, patch);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>Soft-delete a family member.</summary>
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        return store.DeleteMember(id) ? NoContent() : NotFound();
    }
}