using System.Security.Claims;
using System.Text;
using AuthServiceLibrary.Data;
using AuthServiceLibrary.Entities;
using AuthServiceLibrary.Exceptions;
using AuthServiceLibrary.Models;
using AuthServiceLibrary.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace AuthServiceLibrary.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly AuthDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UserManagementService(AuthDbContext context, UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task DeleteByUsernameAsync(string username)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(username);
                if (user == null)
                    throw new NotFoundException($"Username: '{username}' does not exist in the system.");

                var result = await _userManager.DeleteAsync(user);
                if(!result.Succeeded)
                    throw new Exception($"Failed to delete user.");
            }
            catch (DbUpdateException ex)
            {
                throw new DatabaseException("Failed to delete user.", ex);
            }
        }

        public async Task<IEnumerable<UserModel>> GetAllAsync()
        {
            try
            {
                var result = await _userManager.Users.ToListAsync();
                return _mapper.Map<IEnumerable<UserModel>>(result);
            }
            catch (Exception ex)
            {
                throw new DatabaseException("Failed to fetch users.", ex);
            }
        }

        public async Task<UserModel> GetByUsernameAsync(string username)
        {

            try
            {
                var user = await _userManager.FindByNameAsync(username);
                if (user == null)
                    throw new NotFoundException($"Username: '{username}' does not exist in the system.");
                return _mapper.Map<UserModel>(user);
            }
            catch (DbUpdateException ex)
            {
                throw new DatabaseException("Failed to fetch user from database.", ex);
            }
        }

        public async Task<AuthResult> RegisterUser(UserRegisterModel model)
        {
            await CheckIfUserNameOrEmailIsTaken(model);
            AuthResult retVal = null;
            var executionStrategy = _context.Database.CreateExecutionStrategy();

            await executionStrategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        //Adding User
                        ApplicationUser user = _mapper.Map<ApplicationUser>(model);
                        IdentityResult result = await _userManager.CreateAsync(user, model.Password);
                        if (!result.Succeeded) { throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description))); }


                        //Adding User Roles
                        if (model.Roles.Count > 0)
                        {
                            IdentityResult roleCreateResult = await _userManager.AddToRolesAsync(user, model.Roles);
                            if (!roleCreateResult.Succeeded) { throw new Exception(string.Join(", ", roleCreateResult.Errors.Select(e => e.Description))); }
                        }

                        //Add UserClaims
                        IdentityResult claimCreateResult = await _userManager.AddClaimsAsync(user, GetUserClaims(user, model.Roles));
                        if (!claimCreateResult.Succeeded) { throw new Exception(string.Join(", ", claimCreateResult.Errors.Select(e => e.Description))); }

                        //commit transaction after user, userRoles and Userclaims are created. 
                        await transaction.CommitAsync();

                        //Email confirmation token has to be sent to an email
                        var emailConfirmation = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        
                        //Return value
                        retVal = new AuthResult
                        {
                            Succeeded = true,
                            Roles = model.Roles,
                            Token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmation))
                        };
                    }
                    catch (Exception ex)
                    {
                        //Rollback transaction if failed to created.
                        await transaction.RollbackAsync();
                        throw new DatabaseException(ex.Message, ex);
                    }
                }

            });
            return retVal;
        }

        private async Task CheckIfUserNameOrEmailIsTaken(UserRegisterModel model)
        {
            ApplicationUser? user = await _userManager.FindByNameAsync(model.Username);
            if(user is not null)
            {
                throw new Exception($"Username: {model.Username} is already taken.");
            }

            user = await _userManager.FindByEmailAsync(model.Email);
            if (user is not null)
            {
                throw new Exception($"Email: {model.Email} already found in the system.");
            }
        }

        #region Private
        private List<Claim> GetUserClaims(ApplicationUser user, List<string> roles = null)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new("FirstName", user.FirstName),
                new("LastName", user.LastName),
                new(ClaimTypes.Email, user.Email)
            };
            if (roles is not null && roles.Count > 0)
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return claims;
        }
        #endregion
    }
}
