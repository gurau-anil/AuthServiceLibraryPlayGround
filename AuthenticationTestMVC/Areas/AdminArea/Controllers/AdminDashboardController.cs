using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestMVC.Areas.AdminArea.Controllers
{
    public class AdminDashboardController : AdminBaseController
    {
        [Route("")]
        public IActionResult AdminDashboard()
        {
            return View();
        }
    }
}
