using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            //command sent from the client to save to the database
            var comment = await _mediator.Send(command);

            //send result to anybody who is connected to the hub, including
            //the person that's made the comment in the first place so
            //that can be display in the user interface.
            //(send to a group with same activityId)
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        } 

        //when client connect we add them to a group
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];
            //add connected client to a group with same activityId
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            //send down the list of comments to the client
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});
            
            //send list of comment to the caller, 
            //the person making this request to connect to SignalR hub
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}