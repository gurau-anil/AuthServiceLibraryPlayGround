using AuthenticationTestApi.Services;

namespace AuthenticationTestApi
{
    public static class ServiceRegister
    {

        public static void RegisterServices(this IServiceCollection services, IConfiguration config = null)
        {
            services.AddScoped<IEmailTemplateService, EmailTemplateService>();
        }
    }
}
