using AuthServiceLibrary.Models;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(UserLoginModel model);
        Task<AuthResult> TwoFactorLoginAsync(string userName, string token);
        Task<AuthResult> GetTwoFactorAuthTokenAsync(string userName);
        Task ValidateEmailToken(string email, string token);
        Task<string> GeneratePasswordResetTokenAsync(string email);
        Task<string> GenerateEmailConfirmationTokenAsync(string email);
        Task ResetPasswordAsync(string email, string password, string token);
        Task LogoutAsync();
    }
}
