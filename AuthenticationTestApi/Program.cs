using System.Collections.Generic;
using System.Reflection;
using AuthenticationTestApi.Middlewares;
using AuthenticationTestApi.Models;
using AuthServiceLibrary;
using AuthServiceLibrary.Models;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")?? String.Empty;
builder.Services.AddJwtAuthentication(connectionString, options =>
{
    options.Issuer = "Test";
    options.Audience = "Test";
    options.ExpirationMinutes = builder.Configuration.GetValue<int>("JwtSettings:ExpiresInMinutes");
    options.SecretKey = builder.Configuration.GetValue<string>("JwtSettings:SecretKey") ?? String.Empty;
},
authOptions =>
{
    authOptions.AddPolicy("CombinedPolicy", policy => policy.RequireRole("Admin").RequireClaim("CanEdit", "true"));
    authOptions.AddPolicy("AdminOnlyPolicy", policy => policy.RequireRole("Admin"));
    authOptions.AddPolicy("CanEditPolicy", policy => policy.RequireClaim("CanEdit", "true"));
},
passwordOptions =>
{
    passwordOptions.Password = new PasswordOptions
    {
        RequireDigit = true,
        RequireNonAlphanumeric = true,
        RequiredLength = 8,
        RequireUppercase = true
    };
    passwordOptions.SignIn.RequireConfirmedEmail = true;
    passwordOptions.SignIn.RequireConfirmedAccount = true;
    passwordOptions.User.RequireUniqueEmail = true;
    passwordOptions.Lockout.MaxFailedAccessAttempts = 3;
    passwordOptions.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(2);
});

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddScoped<IValidator<RegisterModel>, RegisterModelValidator>();
builder.Services.AddScoped<IValidator<LoginModel>, LoginModelValidator>();
builder.Services.AddScoped<IValidator<ResetPasswordModel>, ResetPasswordModelValidator>();

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
builder.Services.AddMemoryCache();


builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", opt=>
    {
        opt.AllowAnyMethod();
        opt.AllowAnyHeader();
        opt.WithOrigins("http://localhost:54646", "http://localhost:57113", "https://localhost:4200");
        opt.AllowCredentials();

    } );
});

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot";
});

//builder.Services.AddRateLimiter(options =>
//{
//    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
//        RateLimitPartition.GetFixedWindowLimiter(
//            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
//            _ => new FixedWindowRateLimiterOptions
//            {
//                PermitLimit = 5, // Allow max 5 consecutive requests
//                Window = TimeSpan.FromSeconds(10), // Block further requests for 10 seconds
//                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
//                QueueLimit = 0 // Do not queue extra requests
//            }));

//    // Custom response when rate limit is exceeded
//    options.OnRejected = async (context, token) =>
//    {
//        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
//        await context.HttpContext.Response.WriteAsync("Too many requests. Try again later.", token);
//    };
//});

var app = builder.Build();

//fetched from UserSecrets
List<UserRegisterModel> userSeeds = builder.Configuration.GetSection("UserSeeds").Get<List<UserRegisterModel>>() ?? new List<UserRegisterModel>();
if (userSeeds.Count > 0)
{
    //Seed Database with initial users
    await app.SeedDbAsync(seedUsers => seedUsers.AddRange(userSeeds));
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/api-docs/swagger.json", "JWT API 1.0"));
}
//app.UseRateLimiter();

//app.UseMiddleware<ApiKeyRateLimitingMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseCors("MyCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// Serve SPA static files
app.UseSpaStaticFiles();
if (app.Environment.IsDevelopment())
{
    app.UseSpa(spa =>
    {
        spa.Options.SourcePath = "../../../ClientApp";
        //spa.UseProxyToSpaDevelopmentServer("https://localhost:4200");
    });
}
else
{
    app.UseSpa(spa =>
    {
        spa.Options.SourcePath = "wwwroot";
    });
}



app.Run();
