using FamilyNewsletter.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/albums")]
public class AlbumsController(DataStore store) : ControllerBase
{
    /// <summary>All albums.</summary>
    [HttpGet]
    public IActionResult GetAll() => Ok(store.Albums.ToList());

    /// <summary>Single album with its photos (sourced from the linked event).</summary>
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var album = store.Albums.FirstOrDefault(a => a.Id == id);
        if (album is null) return NotFound();

        var photos = album.EventId is not null
            ? store.Events
                .FirstOrDefault(e => e.Id == album.EventId)
                ?.Photos ?? []
            : [];

        return Ok(new
        {
            album.Id,
            album.Title,
            album.TitleKn,
            album.CoverUrl,
            album.PhotoCount,
            album.EventId,
            album.Year,
            Photos = photos,
        });
    }
}