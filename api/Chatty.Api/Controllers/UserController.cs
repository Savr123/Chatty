using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using System.Security.Cryptography;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using AutoMapper;

using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;
using Chatty.Api.Services;
using Chatty.Api.Helpers;



namespace Chatty.Api.Controllers;
[Authorize]
[ApiController]
[Route("[controller]")]
public class UserController : Controller {
    private readonly ChatDbContext _context;
    private readonly ILogger _logger;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly AppSettings _appSettings;

    public UserController(ILogger<UserController> logger, 
                          ChatDbContext context, 
                          IMapper mapper, 
                          IUserService userService, 
                          IOptions<AppSettings> appSettings)
    {
        _logger = logger;
        _context = context;
        _mapper = mapper;
        _userService = userService;
        _appSettings = appSettings.Value;
    }

    [HttpPost("authenticate")]
    public IActionResult authenticate([FromBody]UserLoginCredentials userDTO)
    {
        var user = _userService.Authenticate(userDTO.username, userDTO.password);
    
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        return Ok(new {
                Id = user.Id,
                Username = user.username,
                FirstName = user.firstName,
                LastName = user.lastName,
                Token = tokenString
            });
    }

    [AllowAnonymous]
    [HttpPost("Registration")]
    public IActionResult Register([FromBody]UserRegistrationCredentials usrCredentials)
    {
        var user = _mapper.Map<User>(usrCredentials);  
        try
        {
            _userService.Create(user, usrCredentials.password);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}