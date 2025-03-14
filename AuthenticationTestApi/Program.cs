using System.Reflection;
using System.Security.Claims;
using System.Text;
using AuthenticationTestApi.Middlewares;
using AuthServiceLibrary;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")?? String.Empty;
builder.Services.AddJwtAuthentication(connectionString, options =>
{
    options.Issuer = "Test";
    options.Audience = "Test";
    options.ExpirationMinutes = 10;
    options.SecretKey = builder.Configuration.GetValue<string>("JwtSettings:SecretKey")??String.Empty;
},
authOptions =>
{
    authOptions.AddPolicy("CombinedPolicy", policy => policy.RequireRole("Admin").RequireClaim("CanEdit", "true"));
    authOptions.AddPolicy("AdminOnlyPolicy", policy => policy.RequireRole("Admin"));
    authOptions.AddPolicy("CanEditPolicy", policy => policy.RequireClaim("CanEdit", "true"));
});

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("api-docs", new OpenApiInfo { Title = "JWT API", Version = "1.0" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by JWT token. Example : Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", opt=>
    {
        opt.AllowAnyMethod();
        opt.AllowAnyHeader();
        opt.AllowAnyOrigin();

    } );
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/api-docs/swagger.json", "JWT API 1.0"));
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseCors("MyCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
