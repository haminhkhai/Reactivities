using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                //Describe how cancellation token works
                // try
                // {
                //     for (int i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (System.Exception)
                // {
                //     _logger.LogInformation("Task was cancelled");
                // }

                //test linq for fun
                // var activitiesDto = from a in _context.Activities
                //                     join b in _context.ActivityAttendees
                //                     on a.Id equals b.ActivityId into lj
                //                     select lj;
                var test = _userAccessor.GetUsername();
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                        new { currentUsername = _userAccessor.GetUsername() })
                    .ToListAsync();
            
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}