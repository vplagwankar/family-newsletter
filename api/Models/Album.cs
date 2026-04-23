namespace FamilyNewsletter.Api.Models;

public class Album
{
    public string  Id        { get; set; } = string.Empty;
    public string  Title     { get; set; } = string.Empty;
    public string? TitleKn   { get; set; }
    public string? CoverUrl  { get; set; }
    public int     PhotoCount { get; set; }
    public string? EventId   { get; set; }
    public int     Year      { get; set; }
}