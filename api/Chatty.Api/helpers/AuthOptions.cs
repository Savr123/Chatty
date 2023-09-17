using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Chatty.Api.Helpers
{
    public class AuthOptions
    {
        //TODO: Перенсти константы в переменные среды
        public const string ISSUER = "MyAuthServer"; // Издатель токена
        public const string AUDIENCE = "MyAuthCient"; // Потребитель токена
        const string KEY = "mysupersecret_secretkey!123"; // ключ для шифрования
        public static SymmetricSecurityKey GetSymmetricSecurityKey() => 
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
    }
}