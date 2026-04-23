using FamilyNewsletter.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow the Vite dev server (default ports 5173 / 5174) to call this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteDev", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── JWT Authentication ────────────────────────────────────────────────────────
// Admin endpoints require a Bearer token issued by /api/auth/login.
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = false,
            ValidateAudience         = false,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// ── Data layer ────────────────────────────────────────────────────────────────
// DataStore is a singleton in-memory store seeded with all mock data.
builder.Services.AddSingleton<DataStore>();

var app = builder.Build();

// Force the DataStore singleton to be created (and seeded) at startup.
app.Services.GetRequiredService<DataStore>();

app.UseCors("ViteDev");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();