using EmailService.Model;

namespace EmailService.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(string toEmail, string subject, string body, List<string> attachments = null);
        Task SendAsync(EmailSendModel model);
    }
}
