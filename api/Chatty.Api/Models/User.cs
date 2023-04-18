namespace Chatty.Api.Models;

public class User 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string password { get; set; }
    public int chatId { get; set; }
    public DateTime registrationDate  { get; set; }
}