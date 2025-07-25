using System.Net;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Authorize]
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        // Inject IRoleService into the constructor
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

            var result = await _roleService.CreateRoleAsync(role);
            if (result.Succeeded)
            {
                return StatusCode((int)HttpStatusCode.Created, result);
            }

            return BadRequest(result.Message);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetAll();

            return Ok(roles);
        }

        // DELETE: api/role/{roleId}
        [HttpDelete("{role}")]
        public async Task<IActionResult> DeleteRole(string role)
        {
            var result = await _roleService.DeleteRoleAsync(role);
            if (result.Succeeded)
            {
                return StatusCode((int)HttpStatusCode.OK, result);
            }

            return BadRequest(result.Message);
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

                await _roleService.AddRoleClaim(role, roleClaim);
                return StatusCode((int)HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

