using AuthenticationTestApi.enums;
using AuthenticationTestApi.Models.MergeField;
using AuthenticationTestApi.Models.MergeFields;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/merge-field")]
    [ApiController]
    public class MergeFieldController : ControllerBase
    {

        [HttpGet]
        [Route("")]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> GetAsync(EmailType emailType)
        {
            Type type = null;
            switch (emailType)
            {
                case EmailType.EmailConfirmation:
                    type = typeof(EmailConfirmationMergeField);
                    break;
                case EmailType.PasswordReset:
                    type = typeof(PasswordResetMergeField);
                    break;
                case EmailType.UserRegisterEmailConfirmation:
                    type = typeof(UserRegisterEmailConfirmationMergeField);
                    break;
                case EmailType.TwoFactorAuthentication:
                    type = typeof(TwoFactorAuthenticationMergeField);
                    break;
                default:
                    break;
            }
            List<MergeFieldDTO> mergeFields= type is not null? new MergeFieldDTO().Get(type): new List<MergeFieldDTO>();

            return Ok(mergeFields);
        }
    }
}
