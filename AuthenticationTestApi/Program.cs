using AuthenticationTestApi;
using AuthenticationTestApi.Data;
using AuthenticationTestApi.Middlewares;
using AuthServiceLibrary;
using AuthServiceLibrary.Models;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")?? String.Empty;

var provider = new DbConfigurationProvider(connectionString);

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Add(new DbConfigurationSource(provider));

builder.Services.AddSingleton(provider);

// Add services to the container.
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
    passwordOptions.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
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
    passwordOptions.Lockout.MaxFailedAccessAttempts = builder.Configuration.GetValue<int>("PasswordSettings:AccessAttempts");
    passwordOptions.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(builder.Configuration.GetValue<int>("PasswordSettings:AccountLockoutMinutes"));
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});


builder.Services.RegisterServices(builder.Configuration);

//builder.Services.AddRateLimiter(options =>
//{
//    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
//        RateLimitPartition.GetFixedWindowLimiter(
//            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
//            _ => new FixedWindowRateLimiterOptions
//            {
//                PermitLimit = 10, // Allow max 5 consecutive requests
//                Window = TimeSpan.FromSeconds(10), // Block further requests for 10 seconds
//                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
//                QueueLimit = 0 // Do not queue extra requests
//            }));

//    // Custom response when rate limit is exceeded
//    options.OnRejected = async (context, token) =>
//    {
//        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
//        await context.HttpContext.Response.WriteAsJsonAsync(new { message= "Too many requests. Try again later."}, token);
//    };
//});

var app = builder.Build();
//await app.RunDbMigrationAsync();

//using (var scope = app.Services.CreateScope())
//{
//    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
//}

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
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/api-docs/swagger.json", "Shield API 1.0"));
}
//app.UseRateLimiter();

//app.UseMiddleware<ApiKeyRateLimitingMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseCors("MyCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfire");

app.MapControllers();
// Serve SPA static files
app.UseSpaStaticFiles();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = app.Environment.IsDevelopment()? "../../../ClientApp" : "wwwroot";
});

app.Run();
