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
using Microsoft.AspNetCore.Builder;

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
            if(identityOptions is not null) { services.Configure(identityOptions); }

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
            services.AddIdentity<ApplicationUser, ApplicationRole>(identityOptions)
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
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = config.Jwt.Issuer,
                        ValidAudience = config.Jwt.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(config.Jwt.SecretKey))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Request.Cookies.TryGetValue(AuthConstants.AccessToken, out var accessToken);
                            if (!string.IsNullOrEmpty(accessToken))
                                context.Token = accessToken;
                            return Task.CompletedTask;
                        }
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
            Action<AuthorizationOptions> authOptions = null,
            Action<IdentityOptions> identityOptions = null)
        {
            CookieSettings cookieSettings = new CookieSettings();
            cookieAuthConfig.Invoke(cookieSettings);

            services.AddCustomAuth(connectionString, options =>
            {
                options.Cookie = cookieSettings;
                options.UseCookie = true;
            }, 
            identityOptions: identityOptions,
            authorizationOptions: authOptions);

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            string connectionString,
            Action<JwtSettings> jwtAuthConfig,
            Action<AuthorizationOptions> authOptions = null,
            Action<IdentityOptions> identityOptions = null
            )
        {
            JwtSettings jwtSettings = new JwtSettings();
            jwtAuthConfig.Invoke(jwtSettings);

            services.Configure(jwtAuthConfig);

            services.AddCustomAuth(connectionString, options =>
            {
                options.Jwt = jwtSettings;
                options.UseJwt = true;
            },
            identityOptions: identityOptions,
            authorizationOptions: authOptions);

            return services;
        }

        public static async Task SeedDbAsync(this WebApplication app, Action<List<UserRegisterModel>> registerUser)
        {
            using (var scope = app.Services.CreateScope())
            {
                var authDbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();

                if (await authDbContext.Users.FirstOrDefaultAsync() is not null)
                    return;

                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

                var executionStrategy = authDbContext.Database.CreateExecutionStrategy();

                await executionStrategy.ExecuteAsync(async () =>
                {
                    //Begin Transaction
                    using (var transaction = await authDbContext.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            List<UserRegisterModel> userSeeds = new List<UserRegisterModel>();
                            registerUser.Invoke(userSeeds);


                            List<string?> roles = userSeeds.SelectMany(c => c.Roles.Select(x => x.ToString())).Distinct()
                            .Except(roleManager.Roles.Select(c => c.Name).ToList()).ToList();

                            foreach (var role in roles)
                            {
                                if (!(await roleManager.CreateAsync(new ApplicationRole { Name = role.ToString() })).Succeeded)
                                {
                                    throw new Exception($"Failed to create role {role.ToString()}");
                                }
                            }

                            foreach (var seed in userSeeds)
                            {
                                ApplicationUser user = new ApplicationUser
                                {
                                    FirstName = seed.FirstName,
                                    LastName = seed.LastName,
                                    Email = seed.Email,
                                    UserName = seed.Username,
                                    EmailConfirmed = true
                                };
                                if (!(await userManager.CreateAsync(user, seed.Password)).Succeeded)
                                {
                                    throw new Exception("Failed to create an User");
                                }

                                if (!(await userManager.AddToRolesAsync(user, seed.Roles.Select(c => c.ToString()))).Succeeded)
                                {
                                    throw new Exception("Failed to assign user roles");
                                }
                            }

                            await transaction.CommitAsync();
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            throw new Exception(ex.Message);
                        }
                    }
                });

            }
        }

        public static async Task RunDbMigrationAsync(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var authDbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
                var pendingMigrations = await authDbContext.Database.GetPendingMigrationsAsync();

                if (pendingMigrations.Any())
                {
                    await authDbContext.Database.MigrateAsync();
                }
            }

        }
    }
}
