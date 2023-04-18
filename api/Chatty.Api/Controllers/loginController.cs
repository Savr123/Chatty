using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Models;
using Chatty.Api.Hubs.Clients;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        
        private readonly ILogger _logger;
        private readonly ChatDbContext _context;

        public LoginController(ILogger<ChatController> logger, ChatDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpPost]
        public async Task Post()
        {
            _logger.LogInformation("new log information");
            _logger.LogInformation(Request.Body.ToString());
        }
        
    }
}
