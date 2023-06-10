

namespace Chatty.Api.Models;

public class Chat
{
    public int Id { get; set; }
    public List<User> Users { get; set; } = new();
    // public List<UserChat> UserChats { get; set; } = new();
    public string name { get; set; } = "Unknown";
}