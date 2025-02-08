using System.Text;
using AuthServiceLibrary;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")?? String.Empty;
builder.Services.AddJwtAuthentication(connectionString, options =>
{
    options.Issuer = "Test";
    options.Audience = "Test";
    options.ExpirationMinutes = 10;
    options.SecretKey = builder.Configuration.GetValue<string>("JwtSettings:SecretKey");
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
