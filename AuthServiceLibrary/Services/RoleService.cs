using System.Data;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AuthServiceLibrary.Services
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        public RoleService(RoleManager<ApplicationRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<AuthResponse<string>> CreateRoleAsync(string role)
        {
            var result = await _roleManager.CreateAsync(new ApplicationRole { Name = role});

            AuthResponse<string> retVal = new AuthResponse<string>();

            retVal.Succeeded = result.Succeeded;
            retVal.Message = result.Succeeded? $"Created Role : {role}" : $"Failed to create Role : {role}";
            retVal.Data = result.Succeeded ? role : null;
            return retVal;
        }

        public async Task<AuthResponse<string>> DeleteRoleAsync(string role)
        {
            var roleToDelete = await _roleManager.FindByNameAsync(role);

            AuthResponse<string> retVal = new AuthResponse<string>();
            if (roleToDelete is null)
            {
                retVal.Succeeded = false;
                retVal.Message = $"Role - {role} not Found";
                return retVal;
            }
            var result = await _roleManager.DeleteAsync(roleToDelete);
            retVal.Succeeded = result.Succeeded;
            retVal.Message = retVal.Succeeded ? $"Role - {role} deleted" : $"Failed to delete Role : {role} ";


            return retVal;
        }

        public async Task<List<string>> GetAll()
        {
            return await _roleManager.Roles.Select(c=>c.Name).ToListAsync();
        }

        public async Task AddRoleClaim(string role, IdentityRoleClaim<Guid> roleClaim)
        {
            ApplicationRole? foundRole = await FindRoleAsync(role);
            await _roleManager.AddClaimAsync(foundRole, roleClaim.ToClaim());
        }

        private async Task<ApplicationRole> FindRoleAsync(string role)
        {
            ApplicationRole? foundRole = await _roleManager.FindByNameAsync(role);
            if (foundRole is null)
                throw new Exception($"Role - {role} Not Found in the System.");
            return foundRole;
        }
    }
}
