using AuthenticationTestMVC.Models;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace AuthenticationTestMVC.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IUserManagementService _userManagementService;
        private readonly IMapper _mapper;

        public AuthController(IAuthService authService, IUserManagementService userManagementService, IMapper mapper)
        {
            _authService = authService;
            _userManagementService = userManagementService;
            _mapper = mapper;
        }

        public ActionResult Login()
        {
            return View();
        }
        


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginRequest model, [FromQuery] string ReturnUrl = "/")
        {
            try
            {
                var result = await _authService.LoginAsync(model);
                if (result.Succeeded)
                {
                    return Redirect(ReturnUrl);
                }
                ModelState.AddModelError("Password", "Invalid Login attempt.");
                return View(model);
            }
            catch(Exception ex)
            {
                return View();
            }
        }
        
        public ActionResult RegisterUser()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> RegisterUser(RegisterModel model)
        {
            try
            {
                AuthResult result = await _userManagementService.RegisterUser(_mapper.Map<UserRegisterModel>(model));
                if (result.Succeeded)
                    return RedirectToAction("Login");
                else
                    return View();
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // Sign the user out
            await _authService.LogoutAsync();

            return RedirectToAction("Login", "Auth");
        }
    }
}
