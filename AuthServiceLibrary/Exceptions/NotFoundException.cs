namespace AuthServiceLibrary.Exceptions
{
    public class NotFoundException : Exception
    {
        private const string DefaultMessage = "Item not found";

        public NotFoundException() : base(DefaultMessage)
        {
        }

        public NotFoundException(string? message) : base(string.IsNullOrWhiteSpace(message) ? DefaultMessage : message)
        {
        }
    }
}
