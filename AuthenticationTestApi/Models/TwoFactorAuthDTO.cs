using FluentValidation;

namespace AuthenticationTestApi.Models
{
    public class TwoFactorAuthDTO
    {
        public string Token { get; set; }
        public string Username { get; set; }
    }

    public class TwoFactorAuthDTOValidator : AbstractValidator<TwoFactorAuthDTO>
    {
        public TwoFactorAuthDTOValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required");

            RuleFor(x => x.Token).NotEmpty().WithMessage("Token is required");
        }

    }
}
