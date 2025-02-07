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
        public static IServiceCollection AddCustomAuth(
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
                    //sqlOptions.MigrationsHistoryTable("__CustomAuthMigrationsHistory");
                }));

            // Add Identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddEntityFrameworkStores<AuthDbContext>()
            .AddDefaultTokenProviders();

            //services.AddAuthentication(option =>
            //{
            //    option.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    option.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //}).AddCookie(config.Cookie.AuthenticationScheme,
            //        options =>
            //        {
            //            options.Cookie.Name = config.Cookie.CookieName;
            //            options.ExpireTimeSpan = config.Cookie.ExpireTimeSpan;
            //            options.LoginPath = config.Cookie.LoginPath;
            //            options.LogoutPath = config.Cookie.LogoutPath;
            //            options.AccessDeniedPath = config.Cookie.AccessDeniedPath;
            //            //options.SlidingExpiration = config.Cookie.SlidingExpiration;
            //        });

            

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


            // Add Authentication

            //var authBuilder = services.AddAuthentication(options =>
            //{
            //    if (config.UseCookie && config.UseJwt)
            //    {
            //        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    }
            //    else if (config.UseJwt)
            //    {
            //        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    }
            //    else
            //    {
            //        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    }
            //});

            //// Configure JWT if enabled
            //if (config.UseJwt)
            //{
            //    authBuilder.AddJwtBearer(options =>
            //    {
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateLifetime = true,
            //            ValidateIssuerSigningKey = true,
            //            ValidIssuer = config.Jwt.Issuer,
            //            ValidAudience = config.Jwt.Audience,
            //            IssuerSigningKey = new SymmetricSecurityKey(
            //                Encoding.UTF8.GetBytes(config.Jwt.SecretKey))
            //        };
            //    });
            //}

            // Configure Cookie auth if enabled
            //if (config.UseCookie)
            //{
            //    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
            //        options =>
            //    {
            //        options.Cookie.Name = config.Cookie.CookieName;
            //        options.ExpireTimeSpan = config.Cookie.ExpireTimeSpan;
            //        options.LoginPath = config.Cookie.LoginPath;
            //        options.LogoutPath = config.Cookie.LogoutPath;
            //        options.AccessDeniedPath = config.Cookie.AccessDeniedPath;
            //        //options.SlidingExpiration = config.Cookie.SlidingExpiration;
            //    });
            //}



            // Add services
            //services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddHttpContextAccessor();

            return services;
        }


        public static IServiceCollection AddCustomCookieAuth(
            this IServiceCollection services,
            string connectionString,
            Action<Models.CookieOptions> cookieAuthConfig)
        {
            // Configure Auth
            var config = new Models.CookieOptions();
            cookieAuthConfig.Invoke(config);
            //services.Configure(cookieAuthConfig);

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(config.AuthenticationScheme,
                    options =>
                    {
                        options.Cookie.Name = config.CookieName;
                        options.ExpireTimeSpan = config.ExpireTimeSpan;
                        options.LoginPath = config.LoginPath;
                        options.LogoutPath = config.LogoutPath;
                        options.AccessDeniedPath = config.AccessDeniedPath;
                        //options.SlidingExpiration = config.Cookie.SlidingExpiration;
                    });

            // Add DbContext
            services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Add Authentication

            //var authBuilder = services.AddAuthentication(options =>
            //{
            //    if (config.UseCookie && config.UseJwt)
            //    {
            //        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    }
            //    else if (config.UseJwt)
            //    {
            //        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    }
            //    else
            //    {
            //        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    }
            //});

            //// Configure JWT if enabled
            //if (config.UseJwt)
            //{
            //    authBuilder.AddJwtBearer(options =>
            //    {
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateLifetime = true,
            //            ValidateIssuerSigningKey = true,
            //            ValidIssuer = config.Jwt.Issuer,
            //            ValidAudience = config.Jwt.Audience,
            //            IssuerSigningKey = new SymmetricSecurityKey(
            //                Encoding.UTF8.GetBytes(config.Jwt.SecretKey))
            //        };
            //    });
            //}

            // Configure Cookie auth if enabled
            //if (config.UseCookie)
            //{
            //    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
            //        options =>
            //    {
            //        options.Cookie.Name = config.Cookie.CookieName;
            //        options.ExpireTimeSpan = config.Cookie.ExpireTimeSpan;
            //        options.LoginPath = config.Cookie.LoginPath;
            //        options.LogoutPath = config.Cookie.LogoutPath;
            //        options.AccessDeniedPath = config.Cookie.AccessDeniedPath;
            //        //options.SlidingExpiration = config.Cookie.SlidingExpiration;
            //    });
            //}

            // Add Identity
            //services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            //{
            //    //identityOptions?.Invoke(options);
            //})
            //.AddEntityFrameworkStores<AuthDbContext>()
            //.AddDefaultTokenProviders();

            // Add services
            //services.AddScoped<IJwtService, JwtService>();
            //services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}
