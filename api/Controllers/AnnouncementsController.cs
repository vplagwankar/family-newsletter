using FamilyNewsletter.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/announcements")]
public class AnnouncementsController(DataStore store) : ControllerBase
{
    /// <summary>All announcements, newest first.</summary>
    [HttpGet]
    public IActionResult GetAll()
    {
        var result = store.Announcements
            .OrderByDescending(a => a.Date)
            .ToList();
        return Ok(result);
    }
}