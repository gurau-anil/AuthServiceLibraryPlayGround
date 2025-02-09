using AuthenticationTestApi.Models;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _jwtSettings;
        private readonly IAuthService _authService;
        public AuthenticationController(IConfiguration configuration, IAuthService authService)
        {
            _configuration = configuration;
            _jwtSettings = _configuration.GetSection("JwtSettings");
            _authService = authService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {

            var result = await _authService.LoginAsync(new LoginRequest { Username = model.UserName , Password = model.Password});
            if (result.Succeeded) {
                return Ok(new { Token = result.Token, ExpiresAt = result.ExpiresAt });
            }

            ModelState.AddModelError("Unauthorized", "You are not authorized to access");
            return Unauthorized(ModelState);
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest model)
        {

            var result = await _authService.RegisterAsync(model);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest("Something went wrong");
        }
    }
}
