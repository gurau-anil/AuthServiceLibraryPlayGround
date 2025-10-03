using AuthenticationTestApi.Entities;
using AuthenticationTestApi.Helpers;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json.Linq;

namespace AuthenticationTestApi
{
    public class DbConfigurationProvider : ConfigurationProvider
    {
        private readonly string _connectionString;
        public DbConfigurationProvider(string connectionString)
        {
            _connectionString = connectionString;
        }
        public override void Load()
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    Dictionary<string, string> data = conn.Query<AppSettings>("SELECT [Key], [Value] FROM AppSettings").ToDictionary(
                        x => x.Key,
                        y => y.Value is not null ?
                        y.Key.ToLower().EndsWith("password") ?
                        Decrypt(y.Value) :
                        y.Value :
                        string.Empty
                        );
                    Data = data;
                    conn.Close();
                }
            OnReload();

            }
            catch (Exception ex)
            {
            }
        }

        public void RefreshConfiguration()
        {
            Load();
        }

        private string Decrypt(string value)
        {
            return CryptographyHelper.Decrypt(value, Environment.GetEnvironmentVariable("EncryptionSecretKey"));
        }
    }


    public class DbConfigurationSource : IConfigurationSource
    {
        private readonly DbConfigurationProvider _provider;
        public DbConfigurationSource(DbConfigurationProvider provider)
        {
            _provider = provider;
        }

        public IConfigurationProvider Build(IConfigurationBuilder builder)
        {
            return _provider;
        }
    }
}
