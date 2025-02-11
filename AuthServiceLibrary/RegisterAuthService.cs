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
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace AuthServiceLibrary
{
    public static class ServiceCollectionExtensions
    {
        private static IServiceCollection AddCustomAuth(
            this IServiceCollection services,
            string connectionString,
            Action<AuthConfiguration> authConfig,
            Action<IdentityOptions>? identityOptions = null,
            Action<AuthorizationOptions> authorizationOptions = null)
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

            if(authorizationOptions is not null) { services.AddAuthorization(authorizationOptions); }
            

            // Add services
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserManagementService, UserManagementService>();
            services.AddHttpContextAccessor();

            //Add Automapper
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            return services;
        }


        public static IServiceCollection AddCookieAuthentication(
            this IServiceCollection services,
            string connectionString,
            Action<CookieSettings> cookieAuthConfig,
            Action<AuthorizationOptions> authOptions = null)
        {
            CookieSettings cookieSettings = new CookieSettings();
            cookieAuthConfig.Invoke(cookieSettings);

            services.AddCustomAuth(connectionString, options =>
            {
                options.Cookie = cookieSettings;
                options.UseCookie = true;
            }, authorizationOptions: authOptions);

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            string connectionString,
            Action<JwtSettings> jwtAuthConfig,
            Action<AuthorizationOptions> authOptions = null
            )
        {
            JwtSettings jwtSettings = new JwtSettings();
            jwtAuthConfig.Invoke(jwtSettings);

            services.Configure(jwtAuthConfig);

            services.AddCustomAuth(connectionString, options =>
            {
                options.Jwt = jwtSettings;
                options.UseJwt = true;
            }, authorizationOptions: authOptions);

            return services;
        }
    }
}
