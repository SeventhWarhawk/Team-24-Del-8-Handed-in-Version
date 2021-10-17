using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Models
{
    public partial class UserPasswordHistory
    {
        public int UserPasswordHistoryId { get; set; }
        public int? UserId { get; set; }
        public DateTime? Date { get; set; }
    }
}
