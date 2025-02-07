using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AuthServiceLibrary.Entities;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequest request);
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        Task<ApplicationUser?> GetUserByIdAsync(Guid userId);
        Task LogoutAsync();
        Task<ClaimsPrincipal> GenerateClaimsPrincipalAsync(ApplicationUser user);
    }
}
