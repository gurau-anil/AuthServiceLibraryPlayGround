using AuthenticationTestApi.Attributes;

namespace AuthenticationTestApi.Models.MergeField
{
    public class TwoFactorAuthenticationMergeField
    {
        [MergeFieldValue("token")]
        public string Token { get; set; }

    }
}
