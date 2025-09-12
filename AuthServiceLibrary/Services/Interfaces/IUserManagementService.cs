using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IUserManagementService
    {
        Task<AuthResult> RegisterUser(UserRegisterModel model);
        Task<UserModel> GetByUsernameAsync(string username);
        Task<IEnumerable<UserModel>> GetAllAsync();
        Task DeleteByUsernameAsync(string username);
    }
}
