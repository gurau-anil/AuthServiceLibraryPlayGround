using AuthenticationTestApi.Models;
using AuthenticationTestApi.Services;
using EmailService.Model;
using EmailService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/settings")]
    [ApiController]
    [Authorize(Roles="Admin")]
    public class AppSettingsController : ControllerBase
    {
        private readonly IAppSettingService _appSettingsService;

        private readonly IConfiguration _config;

        private readonly IEmailService _emailService;
        public AppSettingsController(IAppSettingService appSettingsService, IConfiguration config, IEmailService emailService)
        {
            _appSettingsService = appSettingsService;
            _config = config;
            _emailService = emailService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAppSettings()
        {
            var test = _config.GetValue<string>("PasswordSettings:AccountLockoutMinutes");
            var emailSettings = _config.GetSection("EmailSettings").Get<EmailSettings>();
            return Ok(await _appSettingsService.GetAppSettings());
        }

        [HttpPut]
        [Route("")]
        public async Task<IActionResult> UpdateAppSettings(string key, AppSettingsModel model)
        {
            await _appSettingsService.UpdateAppSetting(model);
            return Ok("Updated");
        }
    }
}
