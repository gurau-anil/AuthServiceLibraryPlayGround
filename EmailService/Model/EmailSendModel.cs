
namespace EmailService.Model
{
    public class EmailSendModel
    {
        public string RecipientEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<FileAttachment> Attachments { get; set; } = new List<FileAttachment>();
    }

    public class FileAttachment
    {
        public string FileName { get; set; }
        public byte[] File { get; set; }
    }

}
