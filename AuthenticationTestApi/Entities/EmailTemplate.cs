namespace AuthenticationTestApi.Entities
{
    public class EmailTemplate
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsDefault { get; set; }
    }
}
