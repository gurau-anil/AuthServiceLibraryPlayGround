using FluentValidation;
using System;

namespace AuthenticationTestApi.Models
{
    public class RegisterModel
    {
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
    }

    public class RegisterModelValidator : AbstractValidator<RegisterModel>
    {
        public RegisterModelValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required");
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required");

            RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .DependentRules(() =>
            {
                RuleFor(x => x.Email).EmailAddress().WithMessage("Email is not valid.");
            });

            RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .DependentRules(() =>
            {
                RuleFor(x => x.Password)
                    .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
                    .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                    .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                    .Matches("[0-9]").WithMessage("Password must contain at least one number.")
                    .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");
            });

            RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm Password is required.")
            .Equal(x => x.Password).WithMessage("The passwords do not match.");
        }

    }
}
