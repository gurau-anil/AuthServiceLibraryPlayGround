using AuthenticationTestApi.enums;
using AuthenticationTestApi.Helpers;
using AuthenticationTestApi.Models;
using AuthenticationTestApi.Models.MergeField;
using AuthenticationTestApi.Services;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using EmailService.Model;
using EmailService.Services.Interfaces;
using FluentValidation;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/user")]
    public class UserManagementController : BaseApiController
    {
        private readonly IUserManagementService _userManagementService;
        private readonly IMapper _mapper;
        private readonly IValidator<RegisterDTO> _validator;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;

        public UserManagementController(IUserManagementService userManagementService, IMapper mapper, IValidator<RegisterDTO> validator, IConfiguration config, IEmailService emailService, IEmailTemplateService emailTemplateService)
        {
            _userManagementService = userManagementService;
            _mapper = mapper;
            _validator = validator;
            _config = config;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
        }


        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetUsersAsync()
        {
            IEnumerable<UserDTO> users = _mapper.Map<List<UserDTO>>(await _userManagementService.GetAllAsync());
            return Ok(users);
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDTO model)
        {
            await ValidateModelAsync(model, hasMultipleError: true);
            var result = await _userManagementService.RegisterUser(_mapper.Map<UserRegisterModel>(model));

            var emailConfirmationLink = $"{_config.GetValue<string>("ClientUrl")}/auth/confirm-email?email={model.Email}&token={result.Token}";
            
            var emailTemplate = await _emailTemplateService.GetEmailTemplateAsync(EmailType.UserRegisterEmailConfirmation);
            emailTemplate.Body = MergeFieldHelper.PopulateMergeFields(emailTemplate.Body, new UserRegisterEmailConfirmationMergeField
            {
                EmailConfirmationLink = emailConfirmationLink,
                FirstName = model.FirstName,
                LastName = model.LastName
            });



            BackgroundJob.Enqueue<IEmailService>(emailService => emailService.SendAsync(new EmailSendModel
            {
                RecipientEmail = model.Email,
                Subject = emailTemplate.Subject,
                Body = emailTemplate.Body
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
            UserDTO user =_mapper.Map<UserDTO>(await _userManagementService.GetByUsernameAsync(username));
            await _userManagementService.DeleteByUsernameAsync(username);
            return Ok($"User: {username} removed from the system");
        }
    }
}
