using System.Reflection;
using AuthServiceLibrary;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.CookiePolicy;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllersWithViews();

builder.Services.AddCookieAuthentication(
    connectionString?? String.Empty,
    options =>
    {
        options.AuthenticationScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.CookieName = "AuthCookie";
        options.LoginPath = "/auth/login";
        options.LogoutPath = "/auth/Logout";
        options.AccessDeniedPath = "/auth/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromDays(2);
        options.SlidingExpiration = true;
    }
);
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddCookiePolicy(options => {
    options.HttpOnly = HttpOnlyPolicy.Always;  // Ensure cookies are HttpOnly
    options.Secure = CookieSecurePolicy.Always; // Ensure cookies are Secure (only sent over HTTPS)
    options.MinimumSameSitePolicy = SameSiteMode.Strict;     // Prevent CSRF attacks
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "areaRoute",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
