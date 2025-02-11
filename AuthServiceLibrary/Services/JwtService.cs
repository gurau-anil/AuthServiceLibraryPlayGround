using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AuthServiceLibrary.Services
{

    public class JwtService : IJwtService
    {
        private readonly JwtSettings _options;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public JwtService(IOptions<JwtSettings> options, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _options = options.Value;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<AuthResponse> GenerateTokenAsync(ApplicationUser user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            List<Claim> claims = (await _userManager.GetClaimsAsync(user)).ToList();

            List<string> roles = (List<string>)await _userManager.GetRolesAsync(user);

            IList<Claim> roleClaims;
            foreach (var role in roles)
            {
                ApplicationRole? foundRole = await _roleManager.FindByNameAsync(role);
                roleClaims = await _roleManager.GetClaimsAsync(foundRole);
                claims.AddRange(roleClaims);
            }

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            

            var expires = DateTime.UtcNow.AddMinutes(_options.ExpirationMinutes);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials
            );

            return new AuthResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires,
                Roles = roles
            };
        }
    }
}
