using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class SaleVM
    {
        public class SaleDataVM
        {
            public string emailAddress { get; set; }
            public int employeeID { get; set; }
            public int branchID { get; set; }
            public float saleTotal { get; set; }
            public float? vatTotal { get; set; }
            public float? subtotal { get; set; }
            public string paymentType { get; set; }
            public int? customerID { get; set; }
            public List<dynamic> saleLines { get; set; }
        }
    }
}