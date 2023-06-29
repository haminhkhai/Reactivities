using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }
        //the person who gonna follow another user
        public AppUser Observer { get; set; }
        public string TargetId { get; set; }
        //the person who is followed by observer
        public AppUser Target { get; set; }
    }
}