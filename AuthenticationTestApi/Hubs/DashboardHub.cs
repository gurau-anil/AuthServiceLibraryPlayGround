using AuthenticationTestApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using static AuthenticationTestApi.Services.DashboardService;

namespace AuthenticationTestApi.Hubs
{
    public interface IDashboardClient
    {
        Task UpdateDashboard(DashboardSummary summary);
    }

    [Authorize]
    public class DashboardHub: Hub<IDashboardClient>
    {
        private readonly IDashboardService _dashboardService;
        public DashboardHub(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }
        

        public async Task UpdateDashboard(string message)
        {
            await Clients.All.UpdateDashboard(await _dashboardService.GetDashboardData());
        }
    }
}
