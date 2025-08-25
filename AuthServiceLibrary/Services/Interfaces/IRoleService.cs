
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IRoleService
    {
        Task CreateRoleAsync(string role);
        Task<List<string>> GetAllAsync();
        Task DeleteRoleAsync(string role);
        Task AddRoleClaimAsync(string role, IdentityRoleClaim<Guid> roleClaim);
    }
}
