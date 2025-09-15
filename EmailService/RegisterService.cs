using EmailService.Model;
using EmailService.Services;
using EmailService.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmailService
{
    public static class RegisterService
    {
        public static IServiceCollection AddSmtpEmailService(this IServiceCollection services, Action<EmailSettings> options)
        {
            services.Configure(options);
            services.AddTransient<IEmailService, SmtpEmailService>();

            return services;
        }

        public static IServiceCollection AddSmtpEmailService(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
            services.AddTransient<IEmailService, SmtpEmailService>();

            return services;
        }

        public static IServiceCollection AddSmtpEmailService(this IServiceCollection services, EmailSettings emailSettings)
        {
            services.AddTransient<IEmailService, SmtpEmailService>(c => new SmtpEmailService(emailSettings));
            return services;
        }
    }
}
