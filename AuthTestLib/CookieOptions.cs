namespace AuthTestLib
{
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
