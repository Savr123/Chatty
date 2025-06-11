using System.Threading.Tasks;
using Chatty.Api.Hubs.Clients;
using Chatty.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Chatty.Api.Hubs
{
	[Authorize]
	public class ChatHub: Hub<IChatClient>
	{
		private readonly ILogger _logger;
		

		public ChatHub(ILogger<ChatHub> logger)
		{
			_logger = logger;
		}
		public async Task SendMessage(Message message)
		{
			await Clients.All.RecieveMessage(message);
            _logger.LogInformation("connection established twice", DateTime.UtcNow.ToLongTimeString());
		}
	}
}