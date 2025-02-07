using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.DependencyInjection;

namespace AuthTestLib
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddCustomAuthentication(
            this IServiceCollection services,
            string connectionString,
            Action<CookieOptions> cookieOption)
        {
            // Configure Auth
            var config = new CookieOptions();
            cookieOption(config);
            //services.Configure(authConfig);

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                    options =>
                    {
                        options.Cookie.Name = config.CookieName;
                        options.ExpireTimeSpan = config.ExpireTimeSpan;
                        options.LoginPath = config.LoginPath;
                        options.LogoutPath = config.LogoutPath;
                        options.AccessDeniedPath = config.AccessDeniedPath;
                        //options.SlidingExpiration = config.Cookie.SlidingExpiration;
                    });

            return services;
        }
    }
}
