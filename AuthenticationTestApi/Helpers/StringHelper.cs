using System.Text;

namespace AuthenticationTestApi.Helpers
{
    public static class StringHelper
    {
        public static string GenerateRandomPassword(int length)
        {
            const string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowerCase = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

            Random random = new Random();

            StringBuilder password = new StringBuilder();

            //appending random character from UpperCase String
            password.Append(upperCase[random.Next(upperCase.Length)]);

            // appending random character from lowercase String
            password.Append(lowerCase[random.Next(lowerCase.Length)]);

            // appending random character from digits String
            password.Append(digits[random.Next(digits.Length)]);

            // appending random character from special characters String
            password.Append(specialChars[random.Next(specialChars.Length)]);

            //adding remaining characters of the password
            const string allValidChars = upperCase + lowerCase + digits + specialChars;
            for (int i = password.Length; i < length; i++)
            {
                password.Append(allValidChars[random.Next(allValidChars.Length)]);
            }

            // Shuffling the password to randomize
            return new string(password.ToString().OrderBy(c => random.Next()).ToArray());
        }

    }
}
