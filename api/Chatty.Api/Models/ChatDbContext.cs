using Microsoft.EntityFrameworkCore;
//using MySql.Data.EntityFramework;
using Npgsql;

namespace Chatty.Api.Models;

public class ChatDbContext: DbContext
{

    //TODO Configuire OnModelCreating function done
    //
    public ChatDbContext(DbContextOptions<ChatDbContext> options)
        :base(options)
    {
        // Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    //TODO 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
                    .HasKey(user => user.Id);
        modelBuilder.Entity<User>()
                    .HasMany(e => e.Chats)
                    .WithMany(e => e.Users);
        modelBuilder.Entity<User>()
                    .Property(props => props.Id)
                    .ValueGeneratedOnAdd();

        modelBuilder.Entity<Chat>()
                    .HasKey(chat => chat.Id);
                    
        modelBuilder.Entity<Chat>()
                    .Property(props => props.Id)
                    .ValueGeneratedOnAdd();

        modelBuilder.Entity<Message>()
                    .HasKey(msg => msg.Id);
        modelBuilder.Entity<Message>()
                    .Property(props => props.Id)
                    .ValueGeneratedOnAdd();
    }

    public DbSet<Message> Messages => Set<Message>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Chat> Chats => Set<Chat>();
}