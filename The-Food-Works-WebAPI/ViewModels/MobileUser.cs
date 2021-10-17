using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class MobileUser
    {
        public class AuthResponseVM
        {
            public string userID { get; set; }
            public string displayName { get; set; }
            public string token { get; set; }
            public string expiresIn { get; set; }
            public string userRole { get; set; }
        }
    }
}