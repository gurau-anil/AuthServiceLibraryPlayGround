using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Models;
using AutoMapper;

namespace AuthServiceLibrary.MappingProfiles
{
    public class AuthProfile: Profile
    {

        public AuthProfile()
        {
            CreateMap<UserRegisterModel, ApplicationUser>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
