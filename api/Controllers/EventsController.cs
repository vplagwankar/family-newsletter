using FamilyNewsletter.Api.Data;
using FamilyNewsletter.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController(DataStore store) : ControllerBase
{
    // ── Public endpoints ──────────────────────────────────────────────────────

    /// <summary>All published (past) events, newest first.</summary>
    [HttpGet]
    public IActionResult GetPublished()
    {
        var result = store.Events
            .Where(e => e.Published && e.Status != "deleted")
            .OrderByDescending(e => e.Date)
            .ToList();
        return Ok(result);
    }

    /// <summary>N most-recent published events (default 3).</summary>
    [HttpGet("recent")]
    public IActionResult GetRecent([FromQuery] int n = 3)
    {
        var result = store.Events
            .Where(e => e.Published && e.Status != "deleted")
            .OrderByDescending(e => e.Date)
            .Take(n)
            .ToList();
        return Ok(result);
    }

    /// <summary>Upcoming events within the next withinDays days (default 30).</summary>
    [HttpGet("upcoming")]
    public IActionResult GetUpcoming([FromQuery] int withinDays = 30)
    {
        var now   = DateTime.UtcNow.Date;
        var limit = now.AddDays(withinDays);

        var result = store.Events
            .Where(e =>
            {
                if (e.Published || e.Status == "deleted") return false;
                if (!DateOnly.TryParse(e.Date, out var d)) return false;
                var date = d.ToDateTime(TimeOnly.MinValue);
                return date > now && date <= limit;
            })
            .OrderBy(e => e.Date)
            .ToList();
        return Ok(result);
    }

    /// <summary>All non-deleted events (published + upcoming). Used by the public events grid.</summary>
    [HttpGet("all")]
    public IActionResult GetAll()
    {
        var result = store.Events
            .Where(e => e.Status != "deleted")
            .OrderByDescending(e => e.Date)
            .ToList();
        return Ok(result);
    }

    /// <summary>Single event by ID.</summary>
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var ev = store.Events.FirstOrDefault(e => e.Id == id);
        return ev is null ? NotFound() : Ok(ev);
    }

    // ── Admin endpoints (require JWT) ─────────────────────────────────────────

    /// <summary>All events including deleted — for the admin dashboard.</summary>
    [Authorize]
    [HttpGet("admin")]
    public IActionResult GetAdmin()
    {
        var result = store.Events.OrderByDescending(e => e.Date).ToList();
        return Ok(result);
    }

    /// <summary>Create a new event.</summary>
    [Authorize]
    [HttpPost]
    public IActionResult Create([FromBody] FamilyEvent data)
    {
        var created = store.CreateEvent(data);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update an existing event.</summary>
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] FamilyEvent patch)
    {
        var updated = store.UpdateEvent(id, patch);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>Soft-delete an event.</summary>
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        return store.DeleteEvent(id) ? NoContent() : NotFound();
    }

    // ── Photo sub-resource ────────────────────────────────────────────────────

    /// <summary>Add a photo to an event.</summary>
    [Authorize]
    [HttpPost("{eventId}/photos")]
    public IActionResult AddPhoto(string eventId, [FromBody] Photo photo)
    {
        var added = store.AddPhoto(eventId, photo);
        return added is null ? NotFound() : Ok(added);
    }

    /// <summary>Delete a photo from an event.</summary>
    [Authorize]
    [HttpDelete("{eventId}/photos/{photoId}")]
    public IActionResult DeletePhoto(string eventId, string photoId)
    {
        return store.DeletePhoto(eventId, photoId) ? NoContent() : NotFound();
    }

    /// <summary>All photos across all published events (for the gallery).</summary>
    [HttpGet("photos")]
    public IActionResult GetAllPhotos()
    {
        var photos = store.Events
            .Where(e => e.Published && e.Status != "deleted")
            .SelectMany(e => (e.Photos ?? []).Select(p => new
            {
                p.Id, p.Url, p.Alt,
                EventId    = e.Id,
                EventTitle = e.Title,
            }))
            .ToList();
        return Ok(photos);
    }
}