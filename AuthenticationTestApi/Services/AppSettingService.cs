using AuthenticationTestApi.Data;
using AuthenticationTestApi.Entities;
using AuthenticationTestApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationTestApi.Services
{
    public interface IAppSettingService
    {
        Task<List<AppSettingsDTO>> GetAppSettings();
        Task<List<AppSettingsDTO>> GetAppSettings(string category);
        Task<AppSettingsDTO> GetAppSetting(string key);
        Task UpdateAppSetting(AppSettingsUpdateDTO model);
    }
    public class AppSettingService: IAppSettingService
    {
        private readonly AppDbContext _dbContext;
        private readonly DbConfigurationProvider _dbConfigurationProvider;
        public AppSettingService(AppDbContext dbContext, DbConfigurationProvider dbConfigurationProvider)
        {
            _dbContext = dbContext;
            _dbConfigurationProvider = dbConfigurationProvider;
        }

        public async Task<AppSettingsDTO> GetAppSetting(string key)
        {
            var appSetting = await _dbContext.AppSettings
                    .Where(c=>c.Key == key)
                    .Select(c => new { c.Key, c.Value })
                    .FirstOrDefaultAsync();
            if(appSetting == null) 
                return null;

            return new AppSettingsDTO { Key = appSetting.Key, Value = appSetting.Value };
        }

        public async Task<List<AppSettingsDTO>> GetAppSettings()
        {
            var appsettings = await _dbContext.AppSettings.Select(c => new { c.Key, c.Value, c.Name }).ToListAsync();
            return appsettings.Select(c => new AppSettingsDTO { Key = c.Key, Value = c.Value, Name = c.Name }).ToList();
        }

        public async Task<List<AppSettingsDTO>> GetAppSettings(string category)
        {
            var appsettings = await _dbContext.AppSettings.Where(c=>c.Key.StartsWith(category)).Select(c => new { c.Key, c.Value }).ToListAsync();
            return appsettings.Select(c => new AppSettingsDTO { Key = c.Key, Value = c.Value }).ToList();
        }

        public async Task UpdateAppSetting(AppSettingsUpdateDTO model)
        {
            var result = await _dbContext.AppSettings.Where(c => c.Key == model.Key)
                .ExecuteUpdateAsync(c => c.SetProperty(p => p.Value, model.Value));
            if(result== 1)
            {
                _dbConfigurationProvider.RefreshConfiguration();
            }
            else
            {
                throw new Exception("Update failed");
            }
        }
    }
}
