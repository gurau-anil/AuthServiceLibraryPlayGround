using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestMVC.Areas.AdminArea.Controllers
{
    [Area("AdminArea")]
    [Route("panel/admin")]
    [Authorize(Roles ="Admin")]
    public class AdminBaseController : Controller
    {
    }
}
