using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
namespace The_Food_Works_WebAPI.ViewModels
{
    public class CookingListVm
    {
        public int? CookingListId { get; set; }
        public DateTime? CookingListDate { get; set; }
        public List<BatchLineVm> batchLines { get; set; }
        public List<Batch> batches { get; set; }

    }
}
