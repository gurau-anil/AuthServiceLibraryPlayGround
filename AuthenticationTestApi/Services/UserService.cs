using AuthenticationTestApi.Helpers;
using AuthenticationTestApi.Models;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationTestApi.Services
{
    public interface IUserService
    {
        Task<PagedResult<UserDTO>> GetUsersAsync(int page, int pageSize);
    }
    public class UserService: IUserService
    {
        private readonly IUserManagementService _userManagementService;
        private readonly IMapper _mapper;
        public UserService(IUserManagementService userManagementService, IMapper mapper)
        {
            _userManagementService = userManagementService;
            _mapper = mapper;
        }

        public async Task<PagedResult<UserDTO>> GetUsersAsync(int page, int pageSize)
        {
            IQueryable<UserModel> query = await _userManagementService.GetAsync();

            int totalCount = await query.CountAsync();
            IEnumerable<UserModel> users = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedResult<UserDTO>
            {
                Items = _mapper.Map<IEnumerable<UserDTO>>(users),
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
    }
}
