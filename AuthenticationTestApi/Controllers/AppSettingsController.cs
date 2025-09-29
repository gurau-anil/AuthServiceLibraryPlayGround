using AuthenticationTestApi.Models;
using AuthenticationTestApi.Services;
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
        public AppSettingsController(IAppSettingService appSettingsService)
        {
            _appSettingsService = appSettingsService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAppSettings()
        {
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
