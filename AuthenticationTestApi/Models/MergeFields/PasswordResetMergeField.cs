using AuthenticationTestApi.Attributes;

namespace AuthenticationTestApi.Models.MergeField
{
    public class PasswordResetMergeField
    {
        public string _passwordResetLink;
        [MergeFieldValue("password_reset_link")]
        public string PasswordResetLink
        {
            get => _passwordResetLink;
            set => _passwordResetLink = $"<a href={value} target='_blank'>{value}</a>";
        }

    }
}
