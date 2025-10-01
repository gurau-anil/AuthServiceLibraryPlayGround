namespace AuthenticationTestApi.Services
{
    public partial class DashboardService
    {
        public class DashboardSummary
        {
            public int TotalUsers { get; set; }
            public int ActiveUsers { get; set; }
            public int InActiveUsers { get; set; }
            public int PendingEmailConfirmations { get; set; }
            public int TotalRoles { get; set; }

            public List<UserRegisterData> UserRegisterDatas { get; set; } = new List<UserRegisterData>();
        }

        public class UserRegisterData
        {
            public string RegisteredDate { get; set; }
            public int UserRegistered { get; set; }
        }
    }
}
