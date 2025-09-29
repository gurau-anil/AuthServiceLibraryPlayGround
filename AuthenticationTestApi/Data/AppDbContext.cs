using AuthenticationTestApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationTestApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<AppSettings> AppSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmailTemplate>(entity =>
            {
                entity.ToTable("EmailTemplates");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Subject).HasMaxLength(100).IsRequired(true);
                entity.Property(e => e.Body).IsRequired(true);
            });

            modelBuilder.Entity<AppSettings>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(c => c.Key).IsRequired(true);
                entity.Property(c => c.Value).IsRequired(false);
                entity.HasIndex(e => e.Key).IsUnique();
            });
          
            base.OnModelCreating(modelBuilder);
        }
    }
}
