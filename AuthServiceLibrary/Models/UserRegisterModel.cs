namespace AuthServiceLibrary.Models
{
    public class UserRegisterModel
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
    }
}
