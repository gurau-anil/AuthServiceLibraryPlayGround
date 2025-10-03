using FluentValidation;

namespace AuthenticationTestApi.Models
{
    public class ResetPasswordDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class ResetPasswordModelValidator : AbstractValidator<ResetPasswordDTO>
    {
        public ResetPasswordModelValidator()
        {
            RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is not Provided.")
            .DependentRules(() =>
            {
                RuleFor(x => x.Email).EmailAddress().WithMessage("Email is not valid.");
            });

            RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is not Provided.");

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
