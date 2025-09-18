using AuthenticationTestApi.Models;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using EmailService.Model;
using EmailService.Services.Interfaces;
using FluentValidation;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using Scriban;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/user")]
    public class UserManagementController : BaseApiController
    {
        private readonly IUserManagementService _userManagement;
        private readonly IMapper _mapper;
        private readonly IValidator<RegisterModel> _validator;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly IHostEnvironment _env;

        public UserManagementController(IUserManagementService userManagement, IMapper mapper, IValidator<RegisterModel> validator, IConfiguration config, IEmailService emailService, IHostEnvironment env)
        {
            _userManagement = userManagement;
            _mapper = mapper;
            _validator = validator;
            _config = config;
            _emailService = emailService;
            _env = env;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            await ValidateModelAsync(model, hasMultipleError: true);
            var result = await _userManagement.RegisterUser(_mapper.Map<UserRegisterModel>(model));

            var emailConfirmationLink = $"{_config.GetValue<string>("ClientUrl")}/auth/confirm-email?email={model.Email}&token={result.Token}";
            var emailBody = await GetEmailConfirmationEmailBody(new { EmailConfirmationLink = emailConfirmationLink });

            BackgroundJob.Enqueue<IEmailService>(emailService => emailService.SendAsync(new EmailSendModel
            {
                RecipientEmail = model.Email,
                Subject = "Email Confirmation",
                Body = emailBody
            }));

            return Ok(@$"
                User : {model.Username} registered to the system, 
                and confirmation token has been sent to the email address: {model.Email}. 
                Confirm your Email before LoggingIn.");
        }

        [HttpDelete]
        [Route("{username}")]
        public async Task<IActionResult> DeleteAsync(string username)
        {
            UserModel user = await _userManagement.GetByUsernameAsync(username);
            await _userManagement.DeleteByUsernameAsync(username);
            return Ok($"User: {username} removed from the system");
        }

        private async Task<string> GetEmailConfirmationEmailBody(object model)
        {
            string emailTemplate = await System.IO.File.ReadAllTextAsync(Path.Combine(_env.ContentRootPath, "wwwroot", $"files/{Constants.EmailConfirmationTemplateFileName}"));
            var template = Template.Parse(emailTemplate);
            return template.Render(model);
        }
    }
}
