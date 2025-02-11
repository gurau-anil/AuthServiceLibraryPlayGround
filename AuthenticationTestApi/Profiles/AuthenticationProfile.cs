using AuthenticationTestApi.Models;
using AuthServiceLibrary.Models;
using AutoMapper;

namespace AuthenticationTestApi.Profiles
{
    public class AuthenticationProfile: Profile
    {
        public AuthenticationProfile()
        {
            CreateMap<RegisterModel, UserRegisterModel>().ReverseMap();
        }
    }
}
