namespace Chatty.Api.Models;

public class Message 
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public DateTime date{ get; set; }
    public Chat? Chats { get; set; }
    public User? Users { get; set;}

}