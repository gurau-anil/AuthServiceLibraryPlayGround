using System.Text.RegularExpressions;
using EmailService.Model;
using EmailService.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;


namespace EmailService.Services
{
    public class SmtpEmailService : IEmailService
    {
        private EmailSettings _emailSettings;
        private const int MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB in bytes
        public SmtpEmailService(IOptions<EmailSettings> options)
        {
            _emailSettings = options.Value;
        }

        public SmtpEmailService(EmailSettings emailSettings)
        {
            _emailSettings = emailSettings;
        }

        public async Task SendAsync(string toEmail, string subject, string body, List<string> attachments)
        {
            try
            {
                ValidateEmailSettings();
                ValidateEmailAddress(toEmail);
                MimeMessage message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SmtpUsername));
                message.To.Add(new MailboxAddress("Recipient", toEmail));
                message.Subject = subject;

                BodyBuilder bodyBuilder = new BodyBuilder { HtmlBody = body };

                if (attachments != null && attachments.Count > 0)
                {
                    foreach (var attachmentPath in attachments)
                    {
                        if (File.Exists(attachmentPath))
                        {
                            bodyBuilder.Attachments.Add(attachmentPath);
                        }
                        else
                        {
                            throw new FileNotFoundException($"Attachment file '{attachmentPath}' not found.");
                        }
                    }
                }
                message.Body = bodyBuilder.ToMessageBody();

                await SendEmailAsync(message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SendAsync(EmailSendModel model)
        {
            try
            {
                ValidateEmailModel(model);
                await SendEmailAsync(ConstructEmailMessage(model));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #region Private Methods
        private void ValidateEmailSettings()
        {
            if (_emailSettings is null) throw new Exception("EmailSetting is not provided");
            else if (_emailSettings.SmtpServer is null) throw new Exception("SmtpServer is not provided");
            else if (_emailSettings.SmtpPort == 0) throw new Exception("SmtpPort is not provided");
            else if (_emailSettings.SmtpUsername is null) throw new Exception("SmtpUsername is not provided");
            else if (_emailSettings.SmtpPassword is null) throw new Exception("SmtpPassword is not provided");
        }

        private void ValidateEmailModel(EmailSendModel model)
        {
            ValidateEmailAddress(model.RecipientEmail);
            ValidateAttachments(model.Attachments);
        }

        private void ValidateEmailAddress(string email)
        {
            string emailPattern = @"^(?![.-])([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$";
            if (!Regex.IsMatch(email, emailPattern))
            {
                throw new Exception($"{email} is not a valid email address.");
            }
        }

        private void ValidateAttachments(List<FileAttachment> attachments)
        {
            foreach (var attachment in attachments)
            {
                if (attachment.File.Length > MAX_FILE_SIZE)
                {
                    throw new Exception($"{attachment.FileName} exceeds 10 MB size limit");
                }
            }
        }

        private MimeMessage ConstructEmailMessage(EmailSendModel model)
        {
            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SmtpUsername));
            message.To.Add(new MailboxAddress("Recipient", model.RecipientEmail));
            message.Subject = model.Subject;

            BodyBuilder bodyBuilder = new BodyBuilder { HtmlBody = model.Body };

            if (model.Attachments != null && model.Attachments.Count > 0)
            {
                foreach (var attachment in model.Attachments)
                {
                    bodyBuilder.Attachments.Add(attachment.FileName, attachment.File);
                }
            }

            message.Body = bodyBuilder.ToMessageBody();

            return message;
        }

        private async Task SendEmailAsync(MimeMessage message)
        {
            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.SslOnConnect);
                await client.AuthenticateAsync(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }

        #endregion
    }
}
