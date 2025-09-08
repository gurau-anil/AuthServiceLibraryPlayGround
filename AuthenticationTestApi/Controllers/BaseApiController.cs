using AuthServiceLibrary.Exceptions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        public BaseApiController()
        {

        }

        public async Task ValidateModelAsync<T>(T model, bool hasMultipleError = false) where T : new()
        {
            IValidator<T> service = (IValidator<T>)Request.HttpContext.RequestServices.GetService(typeof(IValidator<T>));
            ValidationResult validationResult = await service.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                throw new ModelValidationException(hasMultipleError ? String.Join('\n', validationResult.Errors.Select(c => c.ErrorMessage)) :
                       validationResult.Errors.Select(c => c.ErrorMessage).First());
            }

        }

    }
}
