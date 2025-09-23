using AuthenticationTestApi.Attributes;

namespace AuthenticationTestApi.Models.MergeField
{
    public class PasswordResetMergeField
    {
        [MergeFieldValue("password_reset_link")]
        public string PasswordResetLink { get; set; }

        //[MergeFieldValue("first_name")]
        //public string FirstName { get; set; }

        //[MergeFieldValue("last_name")]
        //public string LastName { get; set; }

    }
}
