// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace The_Food_Works_WebAPI.Models
{
    public partial class ReportBranchProductStockResult
    {
        public int branch_id { get; set; }
        public string ProductName { get; set; }
        public string ProductStatus { get; set; }
        public decimal? ProductPrice { get; set; }
        public int? QuantityOnHand { get; set; }
        public decimal? ValueOnHand { get; set; }
    }
}
