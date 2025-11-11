using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;
using System.IdentityModel.Tokens.Jwt;
using Chatty.Api.Helpers;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Web;
using Chatty.Api.Services;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        
        private readonly ILogger _logger;
        private readonly ChatDbContext _context;
        private readonly IUserService _userService;

        public LoginController(ILogger<LoginController> logger, IUserService userSerivce, ChatDbContext context)
        {
            _logger = logger;
            _context = context;
            _userService = userSerivce;
        }

        //TODO: Create JWT-token (cuz I wanna make it clear, all by myself)
        [HttpPost]
        public async Task<IActionResult> Post(UserLoginCredentials usrCredentials)
        {
            foreach(var user in _context.Users.ToList())
            {
                if(user.email == usrCredentials.email)
                {
                    _userService.Authenticate(user.email, user.PasswordHash);
                    var response  = new 
                        {
                            access_token = JwtToken,
                            email = user.email,
                            username = user.username,
                            lastName = user.lastName,
                            firstName = user.firstName
                        };
                    _logger.LogInformation("user found!");
                    _logger.LogInformation(user.email);

                    return Json(response);
                }
            }
            _logger.LogInformation(usrCredentials.email);
            return Unauthorized();
        }

    }
}
