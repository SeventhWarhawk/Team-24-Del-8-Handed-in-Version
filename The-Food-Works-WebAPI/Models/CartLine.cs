// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class CartLine
    {
        public int BranchId { get; set; }
        public int ProductId { get; set; }
        public int CartId { get; set; }
        public int Quantity { get; set; }

        public virtual BranchProduct BranchProduct { get; set; }
        public virtual Cart Cart { get; set; }
    }
}