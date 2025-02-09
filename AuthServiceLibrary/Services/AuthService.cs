using System.Security.Claims;
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

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<AuthConfiguration> authConfig,
            IHttpContextAccessor httpContextAccessor,
            IAuthenticationService authenticationService,
            IJwtService jwtService,
            RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authConfig = authConfig.Value;
            _httpContext = httpContextAccessor?.HttpContext;
            _authenticationService = authenticationService;
            _jwtService = jwtService;
            _roleManager = roleManager;
        }

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    ErrorMessage = "Invalid username or password"
                };
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
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
            ClaimsPrincipal claimsPrincipal = await GenerateClaimsPrincipalAsync(user, roles);
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

        public async Task<AuthResult> RegisterAsync(RegisterRequest request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    ErrorMessage = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            if (request.Roles.Count > 0)
            {
                await _userManager.AddToRolesAsync(user, request.Roles);

                var claims = new List<Claim>
                {
                    new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new(ClaimTypes.Name, user.UserName ?? string.Empty),
                    new(ClaimTypes.Email, user.Email ?? string.Empty)
                };
                await _userManager.AddClaimsAsync(user, claims);
            }

            List<string> roles = (await _userManager.GetRolesAsync(user)).ToList();
            var authResult = new AuthResult
            {
                Succeeded = true,
                Roles = roles,
                ClaimsPrincipal = await GenerateClaimsPrincipalAsync(user, roles)
            };

            //if (_authConfig.UseJwt)
            //{
            //    var jwtResult = await _jwtService.GenerateTokenAsync(user, _userManager);
            //    authResult.Token = jwtResult.Token;
            //    authResult.ExpiresAt = jwtResult.ExpiresAt;
            //}

            return authResult;
        }

        public async Task<ApplicationUser?> GetUserByIdAsync(Guid userId)
        {
            return await _userManager.FindByIdAsync(userId.ToString());
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

        private async Task<ClaimsPrincipal> GenerateClaimsPrincipalAsync(ApplicationUser user, List<string> roles)
        {
            var identity = new ClaimsIdentity(await GetClaimsAsync(user, roles), _authConfig.Cookie.AuthenticationScheme);
            return new ClaimsPrincipal(identity);
        }

        private async Task<List<Claim>> GetClaimsAsync(ApplicationUser user, List<string> roles)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return claims;
        }
        #endregion

    }
}

