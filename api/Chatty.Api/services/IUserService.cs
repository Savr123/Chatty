using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;


namespace Chatty.Api.Services
{
    public interface IUserService
    {
        public User Authenticate(string username, string password);
        public IEnumerable<User> GetAll();
        public User GetById(int id);
        public void Delete(int id);
        public User Create(User user, string password);
        public void Update(User user, string? password=null);
    }
}