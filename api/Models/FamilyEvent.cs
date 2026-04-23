namespace FamilyNewsletter.Api.Models;

public class FamilyEvent
{
    public string       Id            { get; set; } = string.Empty;
    public string       Title         { get; set; } = string.Empty;
    public string?      TitleKn       { get; set; }
    public string       Category      { get; set; } = string.Empty;   // puja | ceremony | reunion | celebration
    public string       Date          { get; set; } = string.Empty;   // ISO date string "YYYY-MM-DD"
    public string       Location      { get; set; } = string.Empty;
    public string       Description   { get; set; } = string.Empty;
    public string?      DescriptionKn { get; set; }
    public string?      CoverPhoto    { get; set; }
    public List<Photo>  Photos        { get; set; } = [];
    public bool         Published     { get; set; }                   // true = past, false = upcoming
    public int          AttendeeCount { get; set; }
    public string       CreatedAt     { get; set; } = string.Empty;   // ISO datetime string
    public string       Status        { get; set; } = "active";       // active | deleted
}