using AuthenticationTestApi.Models;
using AuthServiceLibrary;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using EmailService.Model;
using EmailService.Services.Interfaces;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Scriban;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/auth")]
    public class AuthenticationController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _jwtSettings;
        private readonly IAuthService _authService;
        private readonly IHostEnvironment _env;
        public AuthenticationController(IConfiguration configuration,
            IAuthService authService,
            IHostEnvironment env)
        {
            _configuration = configuration;
            _jwtSettings = _configuration.GetSection("JwtSettings");
            _authService = authService;
            _env = env;
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
        [Route("confirm-email")]
        public async Task<IActionResult> ConfirmEmailToken(string email, string token)
        {
            await _authService.ValidateEmailToken(email, Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token)));
            return Ok("Email Validated Successfully");
        }

        [HttpPost]
        [Route("send-email-confirmation")]
        public async Task<IActionResult> SendConfirmEmailToken(string email)
        {
            var token = await _authService.GenerateEmailConfirmationTokenAsync(email);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var emailConfirmationLink = $"{_configuration.GetValue<string>("ClientUrl")}/auth/confirm-email?email={email}&token={encodedToken}";
            var emailBody = await GetEmailConfirmationEmailBody(new { EmailConfirmationLink = emailConfirmationLink });

            BackgroundJob.Enqueue<IEmailService>(emailService => emailService.SendAsync(new EmailSendModel
            {
                RecipientEmail = email,
                Subject = "Email Confirmation",
                Body = emailBody
            }));

            return Ok($"Email Confirmation link has been sent to email: {email}");
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

            var passwordResetLink = $"{_configuration.GetValue<string>("ClientUrl")}/auth/reset-password?token={encodedToken}&email={email}";
            var emailBody = await GetPasswordResetEmailBody(new { PasswordResetLink = passwordResetLink });

            BackgroundJob.Enqueue<IEmailService>(emailService => emailService.SendAsync(new EmailSendModel
            {
                RecipientEmail = email,
                Subject = "Reset your password.",
                Body = emailBody
            }));

            return Ok($"Password reset link has been sent to email: {email}");
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync(ResetPasswordModel model)
        {
            await ValidateModelAsync(model, hasMultipleError: true);
            var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));

            await _authService.ResetPasswordAsync(model.Email, model.Password, token);
            return Ok("Password reset successful.");
        }

        private void IssueAccessTokenCookie(HttpContext context, AuthResult result)
        {
            context.Response.Cookies.Append(AuthConstants.AccessToken, result.Token, new CookieOptions
            {
                Domain = Request.Host.Host,
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
                Domain = Request.Host.Host,
                Path = "/",
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddDays(-1)
            });
        }

        private async Task<string> GetPasswordResetEmailBody(object model)
        {
            string emailTemplate = await System.IO.File.ReadAllTextAsync(Path.Combine(_env.ContentRootPath, "wwwroot", $"files/{Constants.PasswordResetTemplateFileName}"));
            var template = Template.Parse(emailTemplate);
            return template.Render(model);
        }

        private async Task<string> GetEmailConfirmationEmailBody(object model)
        {
            string emailTemplate = await System.IO.File.ReadAllTextAsync(Path.Combine(_env.ContentRootPath, "wwwroot", $"files/{Constants.EmailConfirmationTemplateFileName}"));
            var template = Template.Parse(emailTemplate);
            return template.Render(model);
        }
    }
}
