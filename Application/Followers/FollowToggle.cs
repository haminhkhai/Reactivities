using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //user to follow another user (currently logged in user)
                var observer = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername());

                var target = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == request.TargetUsername);

                if (target == null) return null;

                //check if currently logged in user is following this 'target' user
                var following = await _context.UserFollowing.FindAsync(observer.Id, target.Id);

                //if not then add a new following to db to follow that target user
                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.UserFollowing.Add(following);
                }
                //remove following from db to unfollow that target user
                else
                {
                    _context.UserFollowing.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}