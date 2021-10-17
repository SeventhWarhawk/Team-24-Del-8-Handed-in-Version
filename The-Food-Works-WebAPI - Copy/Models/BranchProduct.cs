﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class BranchProduct
    {
        public BranchProduct()
        {
            CartLine = new HashSet<CartLine>();
            ProductPrice = new HashSet<ProductPrice>();
            SaleLine = new HashSet<SaleLine>();
        }

        public int BranchId { get; set; }
        public int ProductId { get; set; }
        public double? QuantityOnHand { get; set; }
        public double? BaselineQuantity { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual Product Product { get; set; }
        public virtual ICollection<CartLine> CartLine { get; set; }
        public virtual ICollection<ProductPrice> ProductPrice { get; set; }
        public virtual ICollection<SaleLine> SaleLine { get; set; }
    }
}