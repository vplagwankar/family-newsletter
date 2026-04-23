using FamilyNewsletter.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController(DataStore store) : ControllerBase
{
    /// <summary>Full-text search across events, members, and announcements.</summary>
    [HttpGet]
    public IActionResult Search([FromQuery] string q = "")
    {
        var query = q.Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(query))
            return Ok(new { events = Array.Empty<object>(), members = Array.Empty<object>(), announcements = Array.Empty<object>() });

        var events = store.Events
            .Where(e =>
                e.Status != "deleted" &&
                (e.Title.ToLower().Contains(query) ||
                 (e.TitleKn      != null && e.TitleKn.Contains(query)) ||
                 e.Description.ToLower().Contains(query) ||
                 e.Location.ToLower().Contains(query)))
            .ToList();

        var members = store.Members
            .Where(m =>
                !m.Deleted &&
                (m.Name.ToLower().Contains(query) ||
                 (m.NameKn != null && m.NameKn.Contains(query)) ||
                 (m.Bio    != null && m.Bio.ToLower().Contains(query))))
            .ToList();

        var announcements = store.Announcements
            .Where(a =>
                a.Title.ToLower().Contains(query) ||
                (a.TitleKn != null && a.TitleKn.Contains(query)) ||
                (a.Body    != null && a.Body.ToLower().Contains(query)))
            .ToList();

        return Ok(new { events, members, announcements });
    }
}