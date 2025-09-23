using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthenticationTestApi.Migrations
{
    /// <inheritdoc />
    public partial class IsDefault_colume_added_EmailTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "EmailTemplates",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "EmailTemplates");
        }
    }
}
