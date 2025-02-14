using System.Security.Claims;
using AuthenticationTestMVC.Models;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult> Login(LoginModel model, [FromQuery] string ReturnUrl = "/")
        {
            try
            {
                var result = await _authService.LoginAsync(_mapper.Map<UserLoginModel>(model));
                if (result.Succeeded)
                {
                    return LocalRedirect(ReturnUrl);
                }
                ModelState.AddModelError("Password", "Invalid Login attempt.");
                return View(model);
            }
            catch(Exception ex)
            {
                return View();
            }
        }
        
        public ActionResult SignUp()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SignUp(RegisterModel model)
        {
            try
            {
                AuthResult result = await _userManagementService.RegisterUser(_mapper.Map<UserRegisterModel>(model));
                if (result.Succeeded)
                    return RedirectToAction("Login");
                else
                    ModelState.AddModelError(String.Empty, "Failed to Signup.");
                    return View(model);
            }
            catch(Exception ex)
            {
                if(ex.Message.Contains("Email"))
                    ModelState.AddModelError("Email", ex.Message);
                else
                    ModelState.AddModelError("UserName", ex.Message);
                return View(model);
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
