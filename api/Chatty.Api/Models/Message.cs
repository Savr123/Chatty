namespace Chatty.Api.Models;

public class Message 
{
    public string Id { get; set; }
    public string? Text { get; set; }
    public DateTime Date{ get; set; }
    public Chat? Chats { get; set; }
    public User? Users { get; set;}

}