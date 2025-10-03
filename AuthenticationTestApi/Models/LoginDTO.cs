using FluentValidation;

namespace AuthenticationTestApi.Models
{
    public class LoginDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class LoginModelValidator : AbstractValidator<LoginDTO>
    {
        public LoginModelValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage("Username is required");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
        }

    }

}
