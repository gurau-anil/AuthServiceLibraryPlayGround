using AuthenticationTestMVC.Models;
using AuthServiceLibrary.Models;
using AutoMapper;

namespace AuthenticationTestMVC.Profiles
{
    public class AuthenticationProfile: Profile
    {
        public AuthenticationProfile()
        {
            CreateMap<RegisterModel, UserRegisterModel>();
            CreateMap<LoginModel, UserLoginModel>();
        }
    }
}
