// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class SaleType
    {
        public SaleType()
        {
            Sale = new HashSet<Sale>();
        }

        public int SaleTypeId { get; set; }
        public string SaleTypeDescription { get; set; }

        public virtual ICollection<Sale> Sale { get; set; }
    }
}