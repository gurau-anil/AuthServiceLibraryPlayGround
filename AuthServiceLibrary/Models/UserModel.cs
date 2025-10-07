namespace AuthServiceLibrary.Models
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { 
            get => $"{FirstName} {LastName}";
        }
        public string Email { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}
