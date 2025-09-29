using AuthenticationTestApi.enums;
using AuthenticationTestApi.Models.MergeField;
using AuthenticationTestApi.Models.MergeFields;
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
                default:
                    break;
            }
            List<MergeFieldModel> mergeFields= type is not null? new MergeFieldModel().Get(type): new List<MergeFieldModel>();

            return Ok(mergeFields);
        }
    }
}
