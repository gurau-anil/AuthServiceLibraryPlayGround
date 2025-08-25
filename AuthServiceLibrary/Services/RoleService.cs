using System.Data;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Exceptions;
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

        public async Task CreateRoleAsync(string role)
        {
            try
            {
                var result = await _roleManager.CreateAsync(new ApplicationRole { Name = role });
                if (!result.Succeeded)
                {
                    throw new DbUpdateException();
                }
            }
            catch (DbUpdateException ex)
            {

                throw new DatabaseException($"Failed to Create Role: {role}.", ex);
            }
        }

        public async Task DeleteRoleAsync(string role)
        {
            try
            {
                ApplicationRole? roleToDelete = await _roleManager.FindByNameAsync(role);
                if (roleToDelete is null)
                {
                    throw new NotFoundException($"Role: {role} Not Found in the System.");
                }

                var result = await _roleManager.DeleteAsync(roleToDelete);
                if (!result.Succeeded)
                {
                    throw new DbUpdateException();
                }
            }
            catch (DbUpdateException ex)
            {
                throw new DatabaseException("Failed to delete role.", ex);
            }
        }

        public async Task<List<string>> GetAllAsync()
        {
            return await _roleManager.Roles.Select(c=>c.Name).ToListAsync();
        }

        public async Task AddRoleClaimAsync(string role, IdentityRoleClaim<Guid> roleClaim)
        {
            try
            {
                ApplicationRole? foundRole = await FindRoleAsync(role);
                if(foundRole is null)
                {
                    throw new NotFoundException($"Role: {role} not found in the system.");
                }
                await _roleManager.AddClaimAsync(foundRole, roleClaim.ToClaim());
            }
            catch (DbUpdateException ex)
            {
                throw new DatabaseException("Failed to add the role claim", ex);
            }
            
        }

        private async Task<ApplicationRole> FindRoleAsync(string role)
        {
            ApplicationRole? foundRole = await _roleManager.FindByNameAsync(role);
            if (foundRole is null)
            {
                throw new NotFoundException($"Role: {role} Not Found in the System.");
            }
            return foundRole;
        }
    }
}
