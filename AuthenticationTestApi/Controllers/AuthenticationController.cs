using AuthenticationTestApi.Models;
using AuthServiceLibrary;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net;
using System.Text;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/auth")]
    public class AuthenticationController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _jwtSettings;
        private readonly IAuthService _authService;
        public AuthenticationController(IConfiguration configuration, 
            IAuthService authService)
        {
            _configuration = configuration;
            _jwtSettings = _configuration.GetSection("JwtSettings");
            _authService = authService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            await ValidateModelAsync(model, hasMultipleError: true);
            AuthResult result = await _authService.LoginAsync(new UserLoginModel { Username = model.UserName, Password = model.Password });
            IssueAccessTokenCookie(HttpContext, result);
            return Ok(new { IsAuthenticated = true, Token = result.Token, Roles = result.Roles, ExpiresAt = result.ExpiresAt });
        }

        [HttpGet]
        [Route("confirm-email/{userId}/{token}")]
        public async Task<IActionResult> ConfirmEmailToken(string userId, string token)
        {
            await _authService.ValidateEmailToken(userId, token);
            return Ok("Email Validated Successfully");
        }


        [HttpGet]
        [Route("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            ClearAccessTokenCookie(HttpContext);
            return Ok("Sign out successful.");
        }

        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPasswordAsync(string email)
        {
            var token = await _authService.GeneratePasswordResetTokenAsync(email);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            return Ok($"{_configuration.GetValue<string>("ClientUrl")}/auth/reset-password?token={encodedToken}&email={email}");
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync(ResetPasswordModel model)
        {
            var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));

            var result = await _authService.ResetPasswordAsync(model.Email, model.Password, token);
            return result? Ok("Password has been Reset."): StatusCode((int)HttpStatusCode.InternalServerError, "Password Reset Failed.");
        }

        private void IssueAccessTokenCookie(HttpContext context, AuthResult result)
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

        private void ClearAccessTokenCookie(HttpContext context)
        {
            context.Response.Cookies.Append(AuthConstants.AccessToken, "", new CookieOptions
            {
                Domain = "localhost",
                Path = "/",
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddDays(-1)
            });
        }
    }
}
