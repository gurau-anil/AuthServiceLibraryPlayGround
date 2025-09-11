
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(UserLoginModel model);
        Task<bool> ValidateEmailToken(string userId, string token);
        Task<string> GeneratePasswordResetTokenAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string password, string token);
        Task LogoutAsync();
    }
}
