using AuthServiceLibrary.Entities;
namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IJwtService
    {
        Task<AuthResponse> GenerateTokenAsync(ApplicationUser user);
    }
}
