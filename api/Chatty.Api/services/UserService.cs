using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;

using System.Security.Cryptography;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Security.Authentication;


namespace Chatty.Api.Services
{
    public class UserService : IUserService
    {
        ChatDbContext _context;
        private int saltLengthLimit = 32;


        public UserService(ChatDbContext context)
        {
            _context = context;
        }
        public User? Authenticate(string username, string password)
        {
            if(String.IsNullOrEmpty(username) || String.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.username == username);

            //check if user exist
            if(user == null) 
                return null;
            
            if(!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }
        
        public IEnumerable<User> GetAll()
        {
            return _context.Users;
        }
        public User GetById(int id)
        {
            var user = _context.Users.Find(id);
            if(user == null) 
                throw new ApplicationException("Couldn't find user");
            return user;
        }
        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if(user!=null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
        public User Create(User user, string password)
        {
            if(String.IsNullOrEmpty(password))
                throw new AuthenticationException("password is required");

            if(_context.Users.Any(x => x.email == user.email))
                throw new AuthenticationException("email '" + user.email + "' is already taken");

            if(_context.Users.Any(x => x.username == user.username))
                throw new AuthenticationException("username '" + user.username + "' is already taken");
            
            byte[] passwordSalt, passwordHash;
            hashPassword(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.registrationDate = DateTime.Now;
            if (user.email.IndexOf("@") == -1)
                throw new ArgumentException("invalid email format");
            user.username = user.email.Substring(0, user.email.IndexOf("@"));

            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }



        public void Update(User userParam, string? password = null)
        {
            var user = _context.Users.Find(userParam.Id);

            if(user == null) 
                throw new ApplicationException("User not found");
            
            //check if email is already taken
            if(userParam.email != user.email){
                if(_context.Users.Any(x => x.email == userParam.email))
                    throw new ApplicationException("Email '" + userParam.email + "' is already taken");
            }
            //check if username is already taken
            if(userParam.username != user.username){
                if(_context.Users.Any(x => x.username == userParam.username))
                    throw new ApplicationException("Username '" + userParam.username + "' is already taken");
            }

            user.email = userParam.email;
            user.username = userParam.username;
            user.firstName = userParam.firstName;
            user.lastName = userParam.lastName;

            if(String.IsNullOrEmpty(password))
            {
                byte[] passwordHash, passwordSalt;
                hashPassword(password, out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        private static void hashPassword(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (string.IsNullOrWhiteSpace(password)) 
                throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private byte[] GetSalt()
        {
            var salt = new byte[saltLengthLimit];
            using (var random = RandomNumberGenerator.Create())
            {
                random.GetNonZeroBytes(salt);
            }
            return salt;
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if(String.IsNullOrEmpty(password))
                throw new ApplicationException("Password cannot be null or whitespace.");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");
            
            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            
            return true;
        }
    }
}