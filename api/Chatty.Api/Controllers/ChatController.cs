using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Hubs;
using Chatty.Api.Models;
using Chatty.Api.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : Controller
    {
        private readonly IHubContext<ChatHub, IChatClient> _chatHub;

        public ChatController(IHubContext<ChatHub, IChatClient> chatHub)
        {
            _chatHub = chatHub;
        }

        [HttpPost("messages")]
        public async Task Post(ChatMessage message)
        {
            message.date = Convert.ToDateTime(message.date);
            await _chatHub.Clients.All.RecieveMessage(message);
        }
    }
}
