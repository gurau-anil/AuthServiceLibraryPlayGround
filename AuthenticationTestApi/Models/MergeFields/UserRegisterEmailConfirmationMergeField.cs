using AuthenticationTestApi.Attributes;

namespace AuthenticationTestApi.Models.MergeField
{
    public class UserRegisterEmailConfirmationMergeField
    {
        private string _emailConfirmationLink = string.Empty;
        [MergeFieldValue("email_confirmation_link")]
        public string EmailConfirmationLink
        {
            get => _emailConfirmationLink;
            set => _emailConfirmationLink = $"<a href={value} target='_blank'>{value}</a>";
        }

        [MergeFieldValue("first_name")]
        public string FirstName { get; set; }

        [MergeFieldValue("last_name")]
        public string LastName { get; set; }

    }
}
