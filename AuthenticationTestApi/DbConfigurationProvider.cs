using AuthenticationTestApi.Helpers;
using Microsoft.Data.SqlClient;

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
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var command = new SqlCommand("SELECT [Key], [Value] FROM AppSettings", connection);
                    var reader = command.ExecuteReader();
                    var data = new Dictionary<string, string>();
                    while (reader.Read())
                    {
                        string key = reader.GetFieldValue<string>(0);
                        string? value = reader.IsDBNull(1) ? null : reader.GetFieldValue<string>(1) ;
                        data[key] = value is not null ?
                            key.ToLower().EndsWith("password") ? CryptographyHelper.Decrypt(reader.GetFieldValue<string>(1), Environment.GetEnvironmentVariable("EncryptionSecretKey")) : value
                            : string.Empty;
                    }
                    Data = data;
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
