using AuthenticationTestApi.Models;
using AuthServiceLibrary;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
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
            try
            {
                AuthResult result = await _authService.LoginAsync(new UserLoginModel { Username = model.UserName , Password = model.Password});
                if (result.Succeeded)
                {
                    IssueCookie(HttpContext, result);
                    return Ok(new { IsAuthenticated = true, Roles = result.Roles, ExpiresAt = result.ExpiresAt });
                }
                ModelState.AddModelError("Unauthorized", result.ErrorMessage);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Unauthorized", "Either Username or Password is wrong.");
            }
            return Unauthorized(ModelState);

            
        }

        [HttpGet]
        [Route("confirm-email/{userId}/{token}")]
        public async Task<IActionResult> ConfirmEmailToken(string userId, string token)
        {
            try
            {
                var result = await _authService.ValidateEmailToken(userId, token);
                if (result)
                {
                    return Ok("Email Validated Successfully");
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(String.Empty, ex.Message);
            }
            return BadRequest(ModelState);
        }

        private void IssueCookie(HttpContext context, AuthResult result)
        {
            context.Response.Cookies.Append(AuthConstants.AccessToken, result.Token, new CookieOptions
            {
                Domain = "localhost",
                Path = "/",
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Expires = result.ExpiresAt
            });
        }
    }
}
