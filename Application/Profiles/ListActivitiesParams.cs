using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ListActivitiesParams
    {
        public bool isPast { get; set; }
        public bool isFuture { get; set; }
        public bool isHost { get; set; }
    }
}