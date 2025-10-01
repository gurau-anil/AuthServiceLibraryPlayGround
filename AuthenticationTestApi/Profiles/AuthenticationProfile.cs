using AuthenticationTestApi.Models;
using AuthServiceLibrary.Models;
using AutoMapper;
using UserModel = AuthServiceLibrary.Models.UserModel;
using User = AuthenticationTestApi.Models.UserModel;

namespace AuthenticationTestApi.Profiles
{
    public class AuthenticationProfile: Profile
    {
        public AuthenticationProfile()
        {
            CreateMap<RegisterModel, UserRegisterModel>().ReverseMap();
            CreateMap<UserModel, User>().ReverseMap();
        }
    }
}
