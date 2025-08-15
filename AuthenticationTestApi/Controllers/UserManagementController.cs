using AuthenticationTestApi.Models;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/user")]
    public class UserManagementController : BaseApiController
    {
        private readonly IUserManagementService _userManagement;
        private readonly IMapper _mapper;
        private readonly IValidator<RegisterModel> _validator;

        public UserManagementController(IUserManagementService userManagement, IMapper mapper, IValidator<RegisterModel> validator)
        {
            _userManagement = userManagement;
            _mapper = mapper;
            _validator = validator;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            try
            {

                await ValidateModelAsync(model, hasMultipleError: false);
                var result = await _userManagement.RegisterUser(_mapper.Map<UserRegisterModel>(model));
                return Ok($"User : {model.Username} registered to the system");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Errors = ex.Message.Split('\n')
                });
            }
            
        }
    }
}
