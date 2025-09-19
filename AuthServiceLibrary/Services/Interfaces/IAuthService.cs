
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(UserLoginModel model);
        Task ValidateEmailToken(string email, string token);
        Task<string> GeneratePasswordResetTokenAsync(string email);
        Task<string> GenerateEmailConfirmationTokenAsync(string email);
        Task ResetPasswordAsync(string email, string password, string token);
        Task LogoutAsync();
    }
}
