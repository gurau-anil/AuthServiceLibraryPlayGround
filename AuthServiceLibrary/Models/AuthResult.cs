using AuthServiceLibrary.Entities;
using System.Security.Claims;

namespace AuthServiceLibrary.Models
{
    public class AuthResult
    {
        public bool Succeeded { get; set; }
        public string? Token { get; set; }
        public string? TwoFAuthToken { get; set; }
        public bool IsTwoFAuthEnabled { get; set; } = false;
        public DateTime? ExpiresAt { get; set; }
        public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
        public string? ErrorMessage { get; set; }
        public ClaimsPrincipal? ClaimsPrincipal { get; set; }
        public ApplicationUser? User { get; set; }
    }

    public class AuthResponse<T> where T: class
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
    }
}
