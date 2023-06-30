using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userActivityDto = new List<UserActivityDto>();
                var query = _context.ActivityAttendees
                    .Where(u => u.AppUser.UserName == request.Username)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .OrderBy(d => d.Date)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(d => d.Date <= DateTime.Now),
                    "future" => query.Where(d => d.Date >= DateTime.Now),
                    _ => query.Where(u => u.HostUserName.Equals(request.Username))
                };

                return Result<List<UserActivityDto>>.Success(await query.ToListAsync());
            }
        }
    }
}