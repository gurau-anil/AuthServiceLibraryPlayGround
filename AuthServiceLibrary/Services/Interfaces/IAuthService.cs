
using AuthServiceLibrary.Entities;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequest request);
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        Task<ApplicationUser?> GetUserByIdAsync(Guid userId);
        Task LogoutAsync();
    }
}
