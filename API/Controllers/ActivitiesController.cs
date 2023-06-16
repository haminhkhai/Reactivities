using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet] //api/activities
        //CancellationToken is passed from api to application via mediator
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new List.Query(), ct));
        }
        
        [HttpGet("{id}")] //api/activities/guid
        public async Task<IActionResult> GetActivity(Guid id)
        {
            ///////////////////////////////////// {Id = id} object initialize syntax
            return  HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<ActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command {Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command {Id = id}));
        }
    }
}