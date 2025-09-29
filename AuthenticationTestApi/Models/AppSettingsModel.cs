using AuthenticationTestApi.Helpers;
using Newtonsoft.Json.Linq;

namespace AuthenticationTestApi.Models
{
    public class AppSettingsModel
    {

        private string _value;
        public string Key { get; set; }
        public string Name { get; set; }
        public string? Value {
            get => _value;
            set => _value = Key.ToLower().Contains("password") ? CryptographyHelper.Encrypt(value, Environment.GetEnvironmentVariable("EncryptionSecretKey")) : value;
        }
    }
}
