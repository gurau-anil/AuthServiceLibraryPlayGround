using AuthenticationTestApi.Data;
using AuthenticationTestApi.Entities;
using AuthenticationTestApi.enums;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationTestApi.Services
{
    public interface IEmailTemplateService
    {
        Task<EmailTemplate> GetEmailTemplate(EmailType emailType);
        Task UpdateEmailTemplate(EmailTemplate model);
    }
    public class EmailTemplateService: IEmailTemplateService
    {
        private readonly AppDbContext _context;
        public EmailTemplateService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<EmailTemplate> GetEmailTemplate(EmailType emailType)
        {
            var emailTemplate = await _context.EmailTemplates.FirstOrDefaultAsync(t => t.Id == (int)emailType);
            return emailTemplate;
        }

        public async Task UpdateEmailTemplate(EmailTemplate model)
        {
           _context.EmailTemplates.Update(model);
            await _context.SaveChangesAsync();
        }
    }
}
