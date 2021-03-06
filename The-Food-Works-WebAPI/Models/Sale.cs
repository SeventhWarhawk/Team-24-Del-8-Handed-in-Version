// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class Sale
    {
        public Sale()
        {
            Delivery = new HashSet<Delivery>();
            SaleLine = new HashSet<SaleLine>();
            SalePaymentType = new HashSet<SalePaymentType>();
        }

        public int SaleId { get; set; }
        public DateTime DateOfSale { get; set; }
        public double SaleTotal { get; set; }
        public int CustomerId { get; set; }
        public int SaleStatusId { get; set; }
        public int SaleTypeId { get; set; }
        public int CompletionMethodId { get; set; }
        public int? AddressId { get; set; }
        public int? EmployeeId { get; set; }
        public int? BranchId { get; set; }

        public virtual CustomerAddress Address { get; set; }
        public virtual Branch Branch { get; set; }
        public virtual CompletionMethod CompletionMethod { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual Employee Employee { get; set; }
        public virtual SaleStatus SaleStatus { get; set; }
        public virtual SaleType SaleType { get; set; }
        public virtual ICollection<Delivery> Delivery { get; set; }
        public virtual ICollection<SaleLine> SaleLine { get; set; }
        public virtual ICollection<SalePaymentType> SalePaymentType { get; set; }
    }
}