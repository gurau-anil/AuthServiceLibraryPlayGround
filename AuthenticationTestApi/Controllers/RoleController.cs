using System.Net;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Authorize(Roles="Admin")]
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // POST: api/role
        [HttpPost]
        public async Task<IActionResult> CreateRole(string role)
        {
            if (string.IsNullOrEmpty(role))
            {
                return BadRequest("Role data is invalid.");
            }

            await _roleService.CreateRoleAsync(role);
            
            return StatusCode((int)HttpStatusCode.Created, "Role Created Successfully.");
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetAllAsync();
            return Ok(roles);
        }

        // DELETE: api/role/{roleId}
        [HttpDelete("{role}")]
        public async Task<IActionResult> DeleteRole(string role)
        {
            await _roleService.DeleteRoleAsync(role);
            return StatusCode((int)HttpStatusCode.OK, "Role Deleted Successfully.");
        }

        [HttpPost]
        [Route("claim")]
        public async Task<IActionResult> AddRoleClaim(string role, string claimName, string claimValue)
        {
            try
            {
                if (string.IsNullOrEmpty(role))
                {
                    return BadRequest("Role data is invalid.");
                }

                var roleClaim = new IdentityRoleClaim<Guid>();
                roleClaim.ClaimValue = claimValue;
                roleClaim.ClaimType = claimName;

                await _roleService.AddRoleClaimAsync(role, roleClaim);
                return StatusCode((int)HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

