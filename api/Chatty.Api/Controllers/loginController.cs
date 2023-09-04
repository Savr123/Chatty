using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;
using Chatty.Api.Hubs.Clients;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        
        private readonly ILogger _logger;
        private readonly ChatDbContext _context;

        public LoginController(ILogger<LoginController> logger, ChatDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        //TODO: Create JWT-token (cuz I wanna make it clear, all by myself)
        [HttpPost]
        public async Task Post(UserLoginCredentials usrCredentials)
        {
            foreach(var user in _context.Users.ToList()){
                if(user.email == usrCredentials.email)
                    _logger.LogInformation("user found!");
                    _logger.LogInformation(user.email);
            }
            _logger.LogInformation(usrCredentials.email);
        }
        
    }
}
