using System.Net;
using Chatty.Api.Hubs;
using Chatty.Api.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Chatty.Api.Services;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Server=(localdb)\\mssqllocaldb;Database=ChattyDb;Trusted_Connection=True";

// Add logging to console
builder.Logging.ClearProviders();
builder.Logging.AddConsole();


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<ChatDbContext>(
    options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPermission", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
            //   .AllowAnyOrigin();
              .WithOrigins("http://localhost:3000"); 
    });
});

// if (!builder.Environment.IsDevelopment())
// {

// }

builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
    options.HttpsPort = 443;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();


app.MapControllers();

app.UseRouting();

app.UseAuthorization();

app.UseCors("ClientPermission");

app.UseEndpoints((endpoints) =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("hubs/chat");
});

app.Run();
