namespace Chatty.Api.Models;

public class User 
{
    public int Id { get; set; }
    public string firstName { get; set; } = null!;
    public string lastName { get; set; } = null!;
    public string username { get; set; } = null!;
    public byte[] PasswordHash { get; set; } = null!;
    public byte[] PasswordSalt { get; set; } = null!;
    public string email {get;set;} = null!;
    public List<Chat> Chats { get; set; } = new();
    // public List<UserChat> UserChats { get; set; } = new();
    public DateTime registrationDate  { get; set; }
}