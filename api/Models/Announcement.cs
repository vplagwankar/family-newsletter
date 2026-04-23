namespace FamilyNewsletter.Api.Models;

public class Announcement
{
    public string  Id       { get; set; } = string.Empty;
    public string  Type     { get; set; } = string.Empty;  // birth | achievement | marriage | memorial | shraddha | babyShower
    public string  Title    { get; set; } = string.Empty;
    public string? TitleKn  { get; set; }
    public string? Body     { get; set; }
    public string? BodyKn   { get; set; }
    public string  Date     { get; set; } = string.Empty;  // "YYYY-MM-DD"
    public string? Icon     { get; set; }
    public string? MemberId { get; set; }
}