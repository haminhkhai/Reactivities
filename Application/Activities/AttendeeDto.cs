using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class AttendeeDto
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        //this prop is for the current user when they view another user's profile
        //to check if this current user is following that target user
        public bool Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
    }
}