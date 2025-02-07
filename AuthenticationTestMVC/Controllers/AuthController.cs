using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestMVC.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
                return View();
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
        public async Task<ActionResult> RegisterUser(RegisterRequest model)
        {
            try
            {
                await _authService.RegisterAsync(model);
                return RedirectToAction("Login");
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
