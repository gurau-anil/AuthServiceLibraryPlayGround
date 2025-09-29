using System.Security.Cryptography;
using System.Text;

namespace AuthenticationTestApi.Helpers
{
    public class CryptographyHelper
    {
        // Encrypts plain text using the secret key
        public static string Encrypt(string plainText, string secretKey)
        {
            using var aes = Aes.Create();
            aes.Key = GetKey(secretKey, aes.KeySize / 8);
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            var plainBytes = Encoding.UTF8.GetBytes(plainText);
            var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            // Combine IV + cipher for storage
            var combined = new byte[aes.IV.Length + cipherBytes.Length];
            Buffer.BlockCopy(aes.IV, 0, combined, 0, aes.IV.Length);
            Buffer.BlockCopy(cipherBytes, 0, combined, aes.IV.Length, cipherBytes.Length);

            return Convert.ToBase64String(combined);
        }

        // Decrypts cipher text using the secret key
        public static string Decrypt(string cipherText, string secretKey)
        {
            var combined = Convert.FromBase64String(cipherText);

            using var aes = Aes.Create();
            aes.Key = GetKey(secretKey, aes.KeySize / 8);

            // Extract IV
            var iv = new byte[aes.BlockSize / 8];
            var cipherBytes = new byte[combined.Length - iv.Length];
            Buffer.BlockCopy(combined, 0, iv, 0, iv.Length);
            Buffer.BlockCopy(combined, iv.Length, cipherBytes, 0, cipherBytes.Length);
            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            var plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
            return Encoding.UTF8.GetString(plainBytes);
        }

        // Derive a fixed-length key from the secret
        private static byte[] GetKey(string secret, int length)
        {
            using var sha256 = SHA256.Create();
            var keyBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(secret));
            Array.Resize(ref keyBytes, length);
            return keyBytes;
        }
    }
}
