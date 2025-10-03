using AuthenticationTestApi.Models;
using AuthServiceLibrary.Models;
using AutoMapper;

namespace AuthenticationTestApi.Profiles
{
    public class AuthenticationProfile: Profile
    {
        public AuthenticationProfile()
        {
            CreateMap<RegisterDTO, UserRegisterModel>().ReverseMap();
            CreateMap<UserModel, UserDTO>().ReverseMap();
        }
    }
}
