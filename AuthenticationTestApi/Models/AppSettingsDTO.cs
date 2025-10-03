using AuthenticationTestApi.Helpers;
using Newtonsoft.Json.Linq;

namespace AuthenticationTestApi.Models
{
    public class AppSettingsDTO
    {

        private string _value;
        public string Key { get; set; }
        public string Name { get; set; }
        public string? Value {
            get => _value;
            set => _value = Key.ToLower().EndsWith("password") ? CryptographyHelper.Encrypt(value, Environment.GetEnvironmentVariable("EncryptionSecretKey")) : value;
        }
    }

    public class AppSettingsUpdateDTO
    {

        private string _value;
        public string Key { get; set; }
        public string? Value
        {
            get => _value;
            set => _value = Key.ToLower().EndsWith("password") ? CryptographyHelper.Encrypt(value, Environment.GetEnvironmentVariable("EncryptionSecretKey")) : value;
        }
    }
}
