using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class BatchVm 
    {
        public int? BatchId { get; set; }
        public DateTime? CookingListDate { get; set; }

        public int? CookingListId { get; set; }
    }
}
