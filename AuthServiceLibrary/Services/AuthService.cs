using System.Security.Claims;
using AuthServiceLibrary.Data;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Exceptions;
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
        private readonly IdentityOptions _identityOptions;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<AuthConfiguration> authConfig,
            IHttpContextAccessor httpContextAccessor,
            IAuthenticationService authenticationService,
            IJwtService jwtService,
            RoleManager<ApplicationRole> roleManager,
            AuthDbContext context,
            IOptions<IdentityOptions> options)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authConfig = authConfig.Value;
            _httpContext = httpContextAccessor?.HttpContext;
            _authenticationService = authenticationService;
            _jwtService = jwtService;
            _roleManager = roleManager;
            _context = context;
            _identityOptions = options.Value;
        }

        public async Task<AuthResult> LoginAsync(UserLoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                throw new NotFoundException($"User not found in the system.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, _identityOptions.SignIn.RequireConfirmedEmail || _identityOptions.SignIn.RequireConfirmedPhoneNumber || _identityOptions.SignIn.RequireConfirmedAccount);
            if (!result.Succeeded)
            {
                double lockoutMinutes = _identityOptions.Lockout.DefaultLockoutTimeSpan.TotalMinutes;
                throw new UnauthorizedAccessException(result.IsLockedOut ? @$"Account Locked! Please try again after {lockoutMinutes} " + (lockoutMinutes > 1 ? "minutes." : "minute.") : "Failed to Login. Please check the password and try again.");
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


        public async Task<string> GeneratePasswordResetTokenAsync(string email)
        {
            ApplicationUser? user = await _userManager.FindByEmailAsync(email);
            return (user is not null) ? await _userManager.GeneratePasswordResetTokenAsync(user) : null;
        }

        public async Task ResetPasswordAsync(string email, string password, string token)
        {
            ApplicationUser? user = await _userManager.FindByEmailAsync(email);
            if (user is not null)
            {
                var result = await _userManager.ResetPasswordAsync(user, token, password);

                if (!result.Succeeded)
                    throw new InvalidException("Invalid Token.");
            }
            throw new NotFoundException("User not found in the system.");
        }

        public async Task ValidateEmailToken(string userId, string token)
        {
            ApplicationUser? user = await _userManager.FindByIdAsync(userId);
            if (user is not null)
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (!result.Succeeded)
                {
                    throw new InvalidException("Invalid Token.");
                }
            }
            throw new NotFoundException("User not found in the system");
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
            if (roles is not null && roles.Count > 0)
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


        #endregion

    }
}

