using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthServiceLibrary.Models
{
    public class AuthConfiguration
    {
        public JwtOptions Jwt { get; set; } = new();
        public CookieOptions Cookie { get; set; } = new();
        public bool UseJwt { get; set; }
        public bool UseCookie { get; set; }
    }

    public class JwtOptions
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpirationMinutes { get; set; }
    }

    public class CookieOptions
    {
        public string AuthenticationScheme { get; set; } = "CustomAuth";
        public string CookieName { get; set; } = "CustomAuth";
        public TimeSpan ExpireTimeSpan { get; set; } = TimeSpan.FromDays(14);
        public string LoginPath { get; set; } = "/Account/Login";
        public string LogoutPath { get; set; } = "/Account/Logout";
        public string AccessDeniedPath { get; set; } = "/Account/AccessDenied";
        public bool SlidingExpiration { get; set; } = true;
    }
}
