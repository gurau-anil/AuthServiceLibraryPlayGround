//using AuthServiceLibrary;
using AuthServiceLibrary;
using AuthTestLib;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllersWithViews();

//builder.Services.AddCustomCookieAuth(
//    connectionString,
//    authConfig =>
//    {
//        authConfig.AuthenticationScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//        authConfig.CookieName = "AuthCookie";
//        authConfig.LoginPath = "/auth/createdaf";
//        authConfig.LogoutPath = "/Account/Logout";
//        authConfig.AccessDeniedPath = "/Account/AccessDenied";
//        authConfig.ExpireTimeSpan = TimeSpan.FromDays(14);
//    }
//);

builder.Services.AddCustomAuth(
    connectionString,
    authConfig =>
    {
        authConfig.UseJwt = false;
        authConfig.UseCookie = true;
        authConfig.Cookie.AuthenticationScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        authConfig.Cookie.CookieName = "AuthCookie";
        authConfig.Cookie.LoginPath = "/auth/login";
        authConfig.Cookie.LogoutPath = "/Account/Logout";
        authConfig.Cookie.AccessDeniedPath = "/Account/AccessDenied";
        authConfig.Cookie.ExpireTimeSpan = TimeSpan.FromDays(14);
    }
);

//builder.Services.AddCustomAuthentication(connectionString, cookieOptions => {
//    cookieOptions.CookieName = "AuthCookie";
//    cookieOptions.ExpireTimeSpan = TimeSpan.FromDays(14);
//    cookieOptions.LoginPath = "/home/privacy";
//    cookieOptions.LogoutPath = "/Account/Logout";
//    cookieOptions.AccessDeniedPath = "/Account/AccessDenied";

//});


//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
//                    options =>
//                    {
//                        options.Cookie.Name = "AuthCookie";
//                        options.ExpireTimeSpan = TimeSpan.FromDays(14);
//                        options.LoginPath = "/auth/create";
//                        options.LogoutPath = "/Account/Logout";
//                        options.AccessDeniedPath = "/Account/AccessDenied";
//                        //options.SlidingExpiration = config.Cookie.SlidingExpiration;
//                    });



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
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
