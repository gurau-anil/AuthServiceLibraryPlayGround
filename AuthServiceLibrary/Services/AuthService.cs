using System.Security.Claims;
using AuthServiceLibrary.Data;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace AuthServiceLibrary.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly AuthConfiguration _authConfig;
        private readonly HttpContext _httpContext;
        private readonly IAuthenticationService _authenticationService;
        private readonly IJwtService _jwtService;
        private readonly AuthDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<AuthConfiguration> authConfig,
            IHttpContextAccessor httpContextAccessor,
            IAuthenticationService authenticationService,
            IJwtService jwtService,
            RoleManager<ApplicationRole> roleManager,
            AuthDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authConfig = authConfig.Value;
            _httpContext = httpContextAccessor?.HttpContext;
            _authenticationService = authenticationService;
            _jwtService = jwtService;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<AuthResult> LoginAsync(UserLoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    ErrorMessage = "Invalid username or password"
                };
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    ErrorMessage = "Invalid username or password"
                };
            }

            user.LastLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var roles = (await _userManager.GetRolesAsync(user)).ToList();
            var claims = (await _userManager.GetClaimsAsync(user)).ToList();
            ClaimsPrincipal claimsPrincipal = GenerateClaimsPrincipal(user, roles);
            var authResult = new AuthResult
            {
                Succeeded = true,
                Roles = roles,
                ClaimsPrincipal = claimsPrincipal
            };




            // Generate JWT token if JWT auth is enabled
            if (_authConfig.UseJwt)
            {
                AuthResponse jwtResult = await _jwtService.GenerateTokenAsync(user);
                authResult.Token = jwtResult.Token;
                authResult.ExpiresAt = jwtResult.ExpiresAt;
                authResult.Roles = roles;
            }
            else
            {
                AuthenticationProperties authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, //perrform rememberme
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
                };

                await _authenticationService.SignInAsync(_httpContext,
                    _authConfig.Cookie.AuthenticationScheme,
                    claimsPrincipal,
                    authProperties);


                //Or You can login like following

                //await _httpContext.SignInAsync(
                //_authConfig.Cookie.AuthenticationScheme,
                //claimsPrincipal,
                //authProperties);

                //Or like this

                //await _signInManager.SignInAsync(user, true);
            }

            return authResult;
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        #region Claims
        public async Task AddClaimsAsync(ApplicationUser user, IEnumerable<Claim> claims)
        {
            await _userManager.AddClaimsAsync(user, claims);
        }

        public async Task<IList<Claim>> CreateClaimsAsync(ApplicationUser user)
        {
            return await _userManager.GetClaimsAsync(user);
        }

        public async Task<IdentityResult> ReplaceClaimsAsync(ApplicationUser user, Claim oldClaim, Claim newClaim)
        {
            return await _userManager.ReplaceClaimAsync(user, oldClaim, newClaim);
        }

        public async Task<IdentityResult> RemoveClaimsAsync(ApplicationUser user, Claim claim)
        {
            return await _userManager.RemoveClaimAsync(user, claim);
        }

        #endregion

        #region Roles

        public async Task AddRolesAsync(ApplicationUser user, IEnumerable<string> roles)
        {
            await _userManager.AddToRolesAsync(user, roles);
        }

        #endregion

        #region Private

        private ClaimsPrincipal GenerateClaimsPrincipal(ApplicationUser user, List<string> roles)
        {
            var identity = new ClaimsIdentity(GetUserClaims(user, roles), _authConfig.Cookie.AuthenticationScheme);
            return new ClaimsPrincipal(identity);
        }

        private List<Claim> GetUserClaims(ApplicationUser user, List<string> roles = null)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty)
            };
            if(roles is not null && roles.Count > 0)
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return claims;
        }

        private List<Claim> GetRoleClaims(List<string> roles)
        {
            var claims = new List<Claim>
            {

            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return claims;
        }

        private void HandleException(string message)
        {
            throw new Exception(message);
        }

        public async Task<bool> ValidateEmailToken(string userId, string token)
        {
            ApplicationUser? user = await _userManager.FindByIdAsync(userId);
            if(user is null)
            {
                throw new Exception("User not found in the system");
            }
            try
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (!result.Succeeded) {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Email Confirmation Failed");
            }
            return true;
        }
        #endregion

    }
}

