using Chatty.Api.Models;

namespace Chatty.Api.ModelDTO
{
    public class MessageDTO
    {
        public string Id { get; set; }
        public string? Text { get; set; }
        public DateTime Date { get; set; }
        public string ChatId { get; set; }
        public string UserId { get; set; }
    }
}
