using Microsoft.Data.SqlClient;
using Dapper;
using static AuthenticationTestApi.Services.DashboardService;
using AuthenticationTestApi.Data;

namespace AuthenticationTestApi.Services
{
    public interface IDashboardService
    {
        Task<DashboardSummary> GetDashboardData();
    }
    public partial class DashboardService: IDashboardService
    {
        private readonly IConnectionFactory _connectionFactory;
        public DashboardService(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<DashboardSummary> GetDashboardData()
        {
            using (var conn = _connectionFactory.GetConnection)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@UserId", "adf");
                string query = @"
                            SELECT
                                COUNT(Id) AS TotalUsers,
                                COUNT(CASE WHEN IsActive = 1 THEN 1 END) AS ActiveUsers,
                                COUNT(CASE WHEN IsActive = 0 THEN 1 END) AS InActiveUsers,
                                COUNT(CASE WHEN EmailConfirmed = 0 THEN 1 END) AS PendingEmailConfirmations,
	                            (SELECT COUNT(*) FROM AspNetRoles) AS TotalRoles
                            FROM AspNetUsers;

                            WITH DateRange AS (
                                SELECT CAST(GETDATE() - 29 AS DATE) AS [Date]
                                UNION ALL
                                SELECT DATEADD(DAY, 1, [Date])
                                FROM DateRange
                                WHERE [Date] < CAST(GETDATE() AS DATE)
                            ),
                            Registrations AS (
                                SELECT CAST(CreatedAt AS DATE) AS [Date], COUNT(*) AS [UserRegistered]
                                FROM AspNetUsers
                                WHERE CreatedAt >= DATEADD(DAY, -30, GETDATE())
                                GROUP BY CAST(CreatedAt AS DATE)
                            )
                            SELECT 
                                FORMAT(d.[Date], 'MM-dd') AS [RegisteredDate],
                                ISNULL(r.[UserRegistered], 0) AS [UserRegistered]
                            FROM DateRange d
                            LEFT JOIN Registrations r ON d.[Date] = r.[Date]
                            ORDER BY d.[Date]
                            OPTION (MAXRECURSION 0);
                            ";

                var multi = await conn.QueryMultipleAsync(query);

                DashboardSummary summary = await multi.ReadSingleAsync<DashboardSummary>();
                summary.UserRegisterDatas = (await multi.ReadAsync<UserRegisterData>()).ToList();

                return summary;

            }
        }
    }
}
