using Microsoft.EntityFrameworkCore;
using MySql.Data.EntityFramework;

namespace Chatty.Api.Models;

public class ChatDbContext: DbContext
{

    //TODO Configuire OnModelCreating function done
    //
    public ChatDbContext(DbContextOptions<ChatDbContext> options)
        :base(options)
    {
        Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    //TODO 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
                    .HasKey(user => new {user.chatId, user.Id});
        modelBuilder.Entity<Chat>()
                    .HasKey(chat => new {chat.Id, chat.userId});
        modelBuilder.Entity<Message>()
                    .HasKey(msg => new {msg.chatId, msg.Id, msg.userId});
        modelBuilder.Entity<UserChatList>()
                    .HasKey(ucl => new {ucl.chatId, ucl.userId});
    }

    public DbSet<Message> Messages => Set<Message>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Chat> Chats => Set<Chat>();
    public DbSet<UserChatList> UserChatLists => Set<UserChatList>();
}