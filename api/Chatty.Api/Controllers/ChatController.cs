using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Hubs;
using Chatty.Api.Models;
using Chatty.Api.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : Controller
    {
        private readonly IHubContext<ChatHub, IChatClient> _chatHub;
        private readonly ILogger _logger;

        public ChatController(IHubContext<ChatHub, IChatClient> chatHub,ILogger<ChatController> logger)
        {
            _chatHub = chatHub;
            _logger = logger;
        }

        
        [HttpPost("messages")]
        public async Task Post(Message message)
        {
            message.date = Convert.ToDateTime(message.date);
            await _chatHub.Clients.All.RecieveMessage(message);
            _logger.LogInformation("connection established", DateTime.UtcNow.ToLongTimeString());
        }
    }
}
