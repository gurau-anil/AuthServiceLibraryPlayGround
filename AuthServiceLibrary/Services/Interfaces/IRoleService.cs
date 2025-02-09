
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IRoleService
    {
        Task<AuthResponse<string>> CreateRoleAsync(string role);
        Task<List<string>> GetAll();
        Task<AuthResponse<string>> DeleteRoleAsync(string role);
        Task AddRoleClaim(string role, IdentityRoleClaim<Guid> roleClaim);
    }
}
