using AuthenticationTestMVC.Areas.AdminArea.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestMVC.Controllers
{
    public class UserManagementController : AdminBaseController
    {
        private readonly ILogger<UserManagementController> _logger;

        public UserManagementController(ILogger<UserManagementController> logger)
        {
            _logger = logger;
        }

        [Route("register-user")]
        public IActionResult RegisterUser()
        {
            return View();
        }
    }
}
