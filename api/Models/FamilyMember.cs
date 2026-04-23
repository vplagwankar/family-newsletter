namespace FamilyNewsletter.Api.Models;

public class FamilyMember
{
    public string        Id               { get; set; } = string.Empty;
    public string        Name             { get; set; } = string.Empty;
    public string?       NameKn           { get; set; }
    public int           Generation       { get; set; }
    public string        Gender           { get; set; } = string.Empty;  // male | female
    public string?       Role             { get; set; }
    public string?       RoleKn           { get; set; }
    public string?       Dob              { get; set; }                  // "YYYY-MM-DD"
    public bool          IsDeceased       { get; set; }
    public int?          YearDeceased     { get; set; }
    public string?       Photo            { get; set; }
    public string?       Bio              { get; set; }
    public string?       BioKn            { get; set; }
    public List<string>  ParentIds        { get; set; } = [];
    public string?       SpouseId         { get; set; }
    public string?       ContactEmail     { get; set; }
    public bool          IsContactPublic  { get; set; }
    public string?       Tribute          { get; set; }
    public string?       TributeKn        { get; set; }
    public bool          Deleted          { get; set; }                  // soft-delete flag
}