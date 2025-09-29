using AuthenticationTestApi.Entities;
using AuthenticationTestApi.enums;
using AuthenticationTestApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/email-template")]
    [ApiController]
    [Authorize(Roles="Admin")]
    public class EmailTemplateController : ControllerBase
    {
        private readonly IEmailTemplateService _emailTemplateService;
        public EmailTemplateController(IEmailTemplateService emailTemplateService)
        {
            _emailTemplateService = emailTemplateService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetEmailTemplateAsync(EmailType emailType)
        {
            var emailTemplate = await _emailTemplateService.GetEmailTemplate(emailType);
            return Ok(emailTemplate);
            
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> SetEmailTemplateAsync([FromQuery] EmailType emailType, EmailTemplate template)
        {
            var emailTemplate = await _emailTemplateService.GetEmailTemplate(emailType);
            emailTemplate.Body = template.Body;
            emailTemplate.Subject = template.Subject;

            await _emailTemplateService.UpdateEmailTemplate(emailTemplate);

            return Ok("Email template saved sucessfully");

        }
    }
}
