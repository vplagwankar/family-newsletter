using FamilyNewsletter.Api.Models;

namespace FamilyNewsletter.Api.Data;

/// <summary>
/// Singleton in-memory data store. Seeded from SeedData on first use.
/// CRUD methods mutate the in-memory lists (data resets on app restart — same
/// behaviour as the JavaScript mock store).
/// </summary>
public class DataStore
{
    public List<FamilyEvent>   Events        { get; } = SeedData.Events();
    public List<FamilyMember>  Members       { get; } = SeedData.Members();
    public List<Announcement>  Announcements { get; } = SeedData.Announcements();
    public List<Album>         Albums        { get; } = SeedData.Albums();

    // ── ID generators ─────────────────────────────────────────────────────────

    private string NextEventId()  => $"evt-{Events.Count + 1:D3}";
    private string NextMemberId() => $"mem-{Members.Count + 1:D3}";
    private string NextPhotoId()  => Guid.NewGuid().ToString("N")[..8];

    // ── Events ────────────────────────────────────────────────────────────────

    public FamilyEvent CreateEvent(FamilyEvent data)
    {
        data.Id        = NextEventId();
        data.CreatedAt = DateTime.UtcNow.ToString("o");
        data.Status    = "active";
        Events.Add(data);
        return data;
    }

    public FamilyEvent? UpdateEvent(string id, FamilyEvent patch)
    {
        var ev = Events.FirstOrDefault(e => e.Id == id);
        if (ev is null) return null;

        if (!string.IsNullOrWhiteSpace(patch.Title))       ev.Title         = patch.Title;
        if (patch.TitleKn   is not null)                   ev.TitleKn       = patch.TitleKn;
        if (!string.IsNullOrWhiteSpace(patch.Category))    ev.Category      = patch.Category;
        if (!string.IsNullOrWhiteSpace(patch.Date))        ev.Date          = patch.Date;
        if (!string.IsNullOrWhiteSpace(patch.Location))    ev.Location      = patch.Location;
        if (!string.IsNullOrWhiteSpace(patch.Description)) ev.Description   = patch.Description;
        if (patch.DescriptionKn is not null)               ev.DescriptionKn = patch.DescriptionKn;
        if (patch.CoverPhoto is not null)                  ev.CoverPhoto    = patch.CoverPhoto;
        if (!string.IsNullOrWhiteSpace(patch.Status))      ev.Status        = patch.Status;

        ev.Published     = patch.Published;
        ev.AttendeeCount = patch.AttendeeCount;

        return ev;
    }

    public bool DeleteEvent(string id)
    {
        var ev = Events.FirstOrDefault(e => e.Id == id);
        if (ev is null) return false;
        ev.Status = "deleted";
        return true;
    }

    // ── Members ───────────────────────────────────────────────────────────────

    public FamilyMember CreateMember(FamilyMember data)
    {
        data.Id = NextMemberId();
        Members.Add(data);
        return data;
    }

    public FamilyMember? UpdateMember(string id, FamilyMember patch)
    {
        var m = Members.FirstOrDefault(m => m.Id == id);
        if (m is null) return null;

        if (!string.IsNullOrWhiteSpace(patch.Name))   m.Name   = patch.Name;
        if (patch.NameKn   is not null)                m.NameKn = patch.NameKn;
        if (patch.Generation > 0)                      m.Generation = patch.Generation;
        if (!string.IsNullOrWhiteSpace(patch.Gender)) m.Gender = patch.Gender;
        if (patch.Role    is not null)                 m.Role   = patch.Role;
        if (patch.RoleKn  is not null)                 m.RoleKn = patch.RoleKn;
        if (patch.Dob     is not null)                 m.Dob    = patch.Dob;
        if (patch.Photo   is not null)                 m.Photo  = patch.Photo;
        if (patch.Bio     is not null)                 m.Bio    = patch.Bio;
        if (patch.BioKn   is not null)                 m.BioKn  = patch.BioKn;
        if (patch.SpouseId is not null)                m.SpouseId = patch.SpouseId;

        m.IsDeceased      = patch.IsDeceased;
        m.YearDeceased    = patch.YearDeceased;
        m.IsContactPublic = patch.IsContactPublic;

        return m;
    }

    public bool DeleteMember(string id)
    {
        var m = Members.FirstOrDefault(m => m.Id == id);
        if (m is null) return false;
        m.Deleted = true;
        return true;
    }

    // ── Photos ────────────────────────────────────────────────────────────────

    public Photo? AddPhoto(string eventId, Photo photo)
    {
        var ev = Events.FirstOrDefault(e => e.Id == eventId);
        if (ev is null) return null;
        photo.Id = NextPhotoId();
        ev.Photos.Add(photo);
        return photo;
    }

    public bool DeletePhoto(string eventId, string photoId)
    {
        var ev = Events.FirstOrDefault(e => e.Id == eventId);
        if (ev is null) return false;
        var p = ev.Photos.FirstOrDefault(p => p.Id == photoId);
        if (p is null) return false;
        ev.Photos.Remove(p);
        return true;
    }
}