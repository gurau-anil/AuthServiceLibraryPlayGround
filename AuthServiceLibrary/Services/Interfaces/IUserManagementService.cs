using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;

namespace AuthServiceLibrary.Services.Interfaces
{
    public interface IUserManagementService
    {
        Task<AuthResult> RegisterUser(UserRegisterModel model);
    }
}
