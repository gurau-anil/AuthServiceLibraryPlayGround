using System.Text;
using AuthServiceLibrary.Data;
using AuthServiceLibrary.Entities;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using AuthServiceLibrary.Services.Interfaces;
using AuthServiceLibrary.Services;
using AuthServiceLibrary.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;

namespace AuthServiceLibrary
{
    public static class RegisterAuthService
    {
        //public static IServiceCollection AddAuthenticationService(this IServiceCollection services, IConfiguration configuration)
        //{
        //    // Register ApplicationDbContext with the connection string from the consuming app's config
        //    services.AddDbContext<AuthDbContext>(options =>
        //        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        //    // Register Identity with User and Role classes from the consuming project
        //    services.AddIdentity<User, IdentityRole>()
        //        .AddEntityFrameworkStores<AuthDbContext>()
        //        .AddDefaultTokenProviders();

        //    // Optionally, add other authentication services (like JWT Bearer)
        //    services.AddAuthentication(options =>
        //    {
        //        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        //        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        //    })
        //    .AddCookie(options =>
        //    {
        //        options.LoginPath = "/Account/Login";
        //    });

        //    // Add other services if needed (like authorization, etc.)
        //    services.AddAuthorization(options =>
        //    {
        //        // Define any authorization policies if needed
        //    });

        //    return services;
        //}
    }

    public static class ServiceCollectionExtensions
    {
        private static IServiceCollection AddCustomAuth(
            this IServiceCollection services,
            string connectionString,
            Action<AuthConfiguration> authConfig,
            Action<IdentityOptions>? identityOptions = null)
        {
            // Configure Auth
            var config = new AuthConfiguration();
            authConfig.Invoke(config);
            services.Configure(authConfig);

            // Add DbContext
            services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                }));

            // Add Identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddEntityFrameworkStores<AuthDbContext>()
            .AddDefaultTokenProviders();


            if (config.UseJwt)
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                }).AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = config.Jwt.Issuer,
                        ValidAudience = config.Jwt.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(config.Jwt.SecretKey))
                    };

                });
            }
            else if (config.UseCookie)
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                }).AddCookie(options =>
                {
                    options.Cookie.Name = config.Cookie.CookieName;
                    options.ExpireTimeSpan = config.Cookie.ExpireTimeSpan;
                    options.LoginPath = config.Cookie.LoginPath;
                    options.LogoutPath = config.Cookie.LogoutPath;
                    options.AccessDeniedPath = config.Cookie.AccessDeniedPath;
                    options.SlidingExpiration = config.Cookie.SlidingExpiration;
                });


                services.ConfigureApplicationCookie(options =>
                {
                    options.Cookie.Name = config.Cookie.CookieName;
                    options.ExpireTimeSpan = config.Cookie.ExpireTimeSpan;
                    options.LoginPath = config.Cookie.LoginPath;
                    options.LogoutPath = config.Cookie.LogoutPath;
                    options.AccessDeniedPath = config.Cookie.AccessDeniedPath;
                    options.SlidingExpiration = config.Cookie.SlidingExpiration;
                });
            }



            // Add services
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddHttpContextAccessor();

            return services;
        }


        public static IServiceCollection AddCookieAuthentication(
            this IServiceCollection services,
            string connectionString,
            Action<CookieSettings> cookieAuthConfig)
        {
            CookieSettings cookieSettings = new CookieSettings();
            cookieAuthConfig.Invoke(cookieSettings);

            services.AddCustomAuth(connectionString, options =>
            {
                options.Cookie = cookieSettings;
                options.UseCookie = true;
            });

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            string connectionString,
            Action<JwtSettings> jwtAuthConfig)
        {
            JwtSettings jwtSettings = new JwtSettings();
            jwtAuthConfig.Invoke(jwtSettings);

            services.Configure(jwtAuthConfig);

            services.AddCustomAuth(connectionString, options =>
            {
                options.Jwt = jwtSettings;
                options.UseJwt = true;
            });

            return services;
        }
    }
}
