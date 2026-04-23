using FamilyNewsletter.Api.Data;
using FamilyNewsletter.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IConfiguration config) : ControllerBase
{
    /// <summary>
    /// Admin login. Returns a JWT token + admin info on success.
    /// POST /api/auth/login  { "email": "...", "password": "..." }
    /// </summary>
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Find matching admin in the seed list
        var admin = SeedData.Admins.FirstOrDefault(a =>
            a.Email.Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase) &&
            a.Password == request.Password);

        if (admin == default)
            return Unauthorized(new { message = "Invalid email or password." });

        var token = GenerateJwt(admin.Id, admin.Name, admin.Role);
        return Ok(new LoginResponse(token, new AdminInfo(admin.Id, admin.Name, admin.Email, admin.Role)));
    }

    // ── JWT helper ────────────────────────────────────────────────────────────

    private string GenerateJwt(string id, string name, string role)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,  id),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim(ClaimTypes.Role, role),
        };

        var token = new JwtSecurityToken(
            claims:   claims,
            expires:  DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}