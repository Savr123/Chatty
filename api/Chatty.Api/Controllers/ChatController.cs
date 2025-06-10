using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Hubs;
using Chatty.Api.Models;
using Chatty.Api.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Chatty.Api.ModelDTO;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : Controller
    {
        private readonly IHubContext<ChatHub, IChatClient> _chatHub;
        private readonly ILogger _logger;

        public ChatController (IHubContext<ChatHub, IChatClient> chatHub, 
                               ILogger<ChatController> logger)
        {
            _chatHub = chatHub;
            _logger = logger;
        }

        
        [HttpPost("messages")]
        public async Task Post(MessageDTO messageDTO)
        {
            messageDTO.Date = Convert.ToDateTime(messageDTO.Date);
            Message message = new Message()
            {
                Date = messageDTO.Date,
                Id = messageDTO.Id,
                Text = messageDTO.Text,
            };
            await _chatHub.Clients.All.RecieveMessage(message);
            _logger.LogInformation("connection established", DateTime.UtcNow.ToLongTimeString());
        }
    }
}
