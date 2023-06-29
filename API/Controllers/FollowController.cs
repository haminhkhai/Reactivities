using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUsername = username }));
        }

        [HttpGet("{username}")]
        /////////////////////////////////////////route param (username)///////query string (predicate)
        public async Task<IActionResult> GetFollowing(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new List.Query { Username = username, 
                Predicate = predicate }));
        }
    }
}