namespace FamilyNewsletter.Api.Models;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Token, AdminInfo Admin);

public record AdminInfo(string Id, string Name, string Email, string Role);