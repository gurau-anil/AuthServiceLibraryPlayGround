using AuthenticationTestApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationTestApi.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [Authorize(Roles="Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAdminDashboardSummary()
        {
            var result = await _dashboardService.GetDashboardData();
            return Ok(result);
        }
    }
}
