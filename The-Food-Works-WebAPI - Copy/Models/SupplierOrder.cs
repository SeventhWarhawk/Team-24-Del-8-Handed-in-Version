﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class SupplierOrder
    {
        public SupplierOrder()
        {
            SupplierOrderLine = new HashSet<SupplierOrderLine>();
        }

        public int SupplierOrderId { get; set; }
        public DateTime SupplierOrderDate { get; set; }
        public int SupplierId { get; set; }
        public int SupplierOrderStatusId { get; set; }
        public string InvoiceImage { get; set; }

        public virtual Supplier Supplier { get; set; }
        public virtual SupplierOrderStatus SupplierOrderStatus { get; set; }
        public virtual ICollection<SupplierOrderLine> SupplierOrderLine { get; set; }
    }
}