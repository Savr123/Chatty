using AutoMapper;
using Chatty.Api.Models;
using Chatty.Api.ModelsDTO;


namespace Chatty.Api.Helpers
{
    public class AutoMapperProfile: Profile 
    {
        public AutoMapperProfile ()
        {
            CreateMap<User, UserLoginCredentials>().ReverseMap();
        }
    }
}