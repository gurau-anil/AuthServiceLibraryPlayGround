using System.Security.Claims;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace AuthServiceLibrary.Services
{
    public class AuthResult
    {
        public bool Succeeded { get; set; }
        public string? Token { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
        public string? ErrorMessage { get; set; }
        public ClaimsPrincipal? ClaimsPrincipal { get; set; }
    }

    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AuthConfiguration _authConfig;
        private readonly HttpContext _httpContext;
        private readonly IAuthenticationService _authenticationService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<AuthConfiguration> authConfig,
            IHttpContextAccessor httpContextAccessor,
            IAuthenticationService authenticationService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authConfig = authConfig.Value;
            _httpContext = httpContextAccessor?.HttpContext;
            _authenticationService = authenticationService;
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

            var roles = await _userManager.GetRolesAsync(user);
            ClaimsPrincipal claimsPrincipal = await GenerateClaimsPrincipalAsync(user);
            var authResult = new AuthResult
            {
                Succeeded = true,
                Roles = roles,
                ClaimsPrincipal = claimsPrincipal
            };
            var authProperties = new AuthenticationProperties
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

            // Generate JWT token if JWT auth is enabled
            //if (_authConfig.UseJwt)
            //{
            //    var jwtResult = await _jwtService.GenerateTokenAsync(user, _userManager);
            //    authResult.Token = jwtResult.Token;
            //    authResult.ExpiresAt = jwtResult.ExpiresAt;
            //}

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

            var roles = await _userManager.GetRolesAsync(user);
            var claimsPrincipal = await GenerateClaimsPrincipalAsync(user);

            var authResult = new AuthResult
            {
                Succeeded = true,
                Roles = roles,
                ClaimsPrincipal = claimsPrincipal
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

        public async Task<ClaimsPrincipal> GenerateClaimsPrincipalAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var identity = new ClaimsIdentity(claims, _authConfig.Cookie.AuthenticationScheme);
            return new ClaimsPrincipal(identity);
        }
    }
}
