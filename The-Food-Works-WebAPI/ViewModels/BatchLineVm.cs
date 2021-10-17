using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class BatchLineVm 
    {
        public int ProductId { get; set; }
        public int BatchId { get; set; }
        public int Quantity { get; set; }
        public string ProductName { get; set; }
    }
}
