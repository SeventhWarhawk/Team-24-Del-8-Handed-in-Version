﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class SaleStatus
    {
        public SaleStatus()
        {
            Sale = new HashSet<Sale>();
        }

        public int SaleStatusId { get; set; }
        public string SaleStatusDescription { get; set; }

        public virtual ICollection<Sale> Sale { get; set; }
    }
}