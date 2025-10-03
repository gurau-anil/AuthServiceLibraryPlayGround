using AuthenticationTestApi.Data;
using AuthenticationTestApi.Models;
using AuthenticationTestApi.Services;
using EmailService;
using FluentValidation;
using Hangfire;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace AuthenticationTestApi
{
    public static class ServiceRegister
    {

        public static void RegisterServices(this IServiceCollection services, IConfiguration config = null)
        {
            services.AddScoped<IEmailTemplateService, EmailTemplateService>();

            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddScoped<IValidator<RegisterDTO>, RegisterModelValidator>();
            services.AddScoped<IValidator<LoginDTO>, LoginModelValidator>();
            services.AddScoped<IValidator<ResetPasswordDTO>, ResetPasswordModelValidator>();
            services.AddScoped<IValidator<TwoFactorAuthDTO>, TwoFactorAuthDTOValidator>();

            services.AddScoped<IAppSettingService, AppSettingService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddSingleton<IConnectionFactory, ConnectionFactory>();

            services.AddCors(options =>
            {
                options.AddPolicy("MyCorsPolicy", opt =>
                {
                    opt.AllowAnyMethod();
                    opt.AllowAnyHeader();
                    opt.WithOrigins($"{config.GetValue<string>("ClientUrl")}");
                    opt.AllowCredentials();

                });
            });

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot";
            });
            services.AddSmtpEmailService(config);

            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(config.GetConnectionString("HangfireConnection") ?? String.Empty));
            services.AddHangfireServer();

            services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("api-docs", new OpenApiInfo { Title = "JWT API", Version = "1.0" });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' followed by JWT token. Example : Bearer {token}"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement{
                    {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                    }
                });
            });
            services.AddMemoryCache();
        }
    }
}
