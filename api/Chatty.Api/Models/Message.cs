namespace Chatty.Api.Models;

public class Message 
{
    public int Id { get; set; }
    public string Text { get; set; }
    public DateTime date{ get; set; }
    public int chatId { get; set; }
    public int userId { get; set;}

}