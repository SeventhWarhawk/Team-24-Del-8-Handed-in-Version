using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class AssignProductVM 
    {
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }

        public double? BaselineQuantity { get; set; }

        public double? ProductPriceAmount { get; set; }

        public int? BranchId { get; set; }

        public double? QuantityOnHand { get; set; }

        public DateTime? ProductPriceDate { get; set; }

        public string ProductType { get; set; }
    }
}
