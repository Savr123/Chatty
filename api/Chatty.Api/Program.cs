using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

using Chatty.Api.Services;
using Chatty.Api.Models;
using Chatty.Api.Helpers;
using Chatty.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnectionString");
var httpPort = builder.Configuration.GetValue<string>("httpPort");
var httpsPort = builder.Configuration.GetValue<string>($"httpsPort");
var corsOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>() ?? new[] { "http://localhost:3000" };

#region logger
// Add logging to console
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();
#endregion


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<ChatDbContext>(
    //options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
    options => options.UseNpgsql(connectionString));

builder.Services.Configure<RouteOptions>(options =>
{
    options.AppendTrailingSlash = false; // Отключаем добавление `/` в конец URL
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPermission", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins(corsOrigins);
    });
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => 
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // указывает, будет ли валидироваться издатель при валидации токена
                        ValidateIssuer = true,
                        // строка, представляющая издателя
                        ValidIssuer = AuthOptions.ISSUER,
                        // будет ли валидироваться потребитель токена
                        ValidateAudience = true,
                        // установка потребителя токена
                        ValidAudience = AuthOptions.AUDIENCE,
                        // будет ли валидироваться время существования
                        ValidateLifetime = true,
                        // установка ключа безопасности
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        // валидация ключа безопасности
                        ValidateIssuerSigningKey = true,
                    };
                    options.Events = new JwtBearerEvents
                    {

                        OnTokenValidated = context =>
                        {
                            var logger = context.HttpContext.RequestServices
                                .GetRequiredService<ILogger<Program>>();

                            logger.LogDebug("=== TOKEN VALIDATED ===");
                            logger.LogDebug($"Token validated for user: {context.Principal.Identity.Name}");

                            return Task.CompletedTask;
                        },

                        OnMessageReceived = context =>
                        {
                            var logger = context.HttpContext.RequestServices
                                .GetRequiredService<ILogger<Program>>();

                            logger.LogDebug("=== MESSAGE RECEIVED ===");
                            logger.LogDebug($"Token: {context.Token}");

                            return Task.CompletedTask;
                        }
                    };
                });
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

//builder.Services.AddHttpsRedirection(options =>
//{
//    options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
//    options.HttpsPort = 443;
//});
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

//app.UseHttpsRedirection();
app.MapControllers();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.MapSwagger("/swagger/{documentName}");  
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseRouting();
app.UseCors("ClientPermission");
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints((endpoints) =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("hubs/chat");
});

app.Map("signIn/{username}", (string username) => 
{
    var claims = new List<Claim> {new Claim(ClaimTypes.Name, username) };
    var jwt = new JwtSecurityToken(
        issuer: AuthOptions.ISSUER,
        audience: AuthOptions.AUDIENCE,
        claims: claims,
        //TODO: Проверить что 2 минуты достаточно для жизни токена
        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
    );
    return new JwtSecurityTokenHandler().WriteToken(jwt);
});

app.Run();