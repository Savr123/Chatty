using Microsoft.AspNetCore.Mvc;
using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;
using System.IdentityModel.Tokens.Jwt;
using Chatty.Api.Helpers;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Web;

namespace Chatty.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        
        private readonly ILogger _logger;
        private readonly ChatDbContext _context;

        public LoginController(ILogger<LoginController> logger, ChatDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        //TODO: Create JWT-token (cuz I wanna make it clear, all by myself)
        [HttpPost]
        public async Task<IActionResult> Post(UserLoginCredentials usrCredentials)
        {
            foreach(var user in _context.Users.ToList())
            {
                if(user.email == usrCredentials.email)
                {
                    var JwtToken = getJWT(usrCredentials.username);
                    var response  = new 
                    {
                        access_token = JwtToken,
                        username = usrCredentials.username,
                        email = usrCredentials.email
                    };
                    _logger.LogInformation("user found!");
                    _logger.LogInformation(user.email);
                    return Json(response);
                }
            }
            _logger.LogInformation(usrCredentials.email);
            return Unauthorized();
        }
        
        private Object getJWT(string username)
        {
            var claims = new List<Claim> {new Claim(ClaimTypes.Name, username) };
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

    }
}
