﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class PaymentType
    {
        public PaymentType()
        {
            SalePaymentType = new HashSet<SalePaymentType>();
        }

        public int PaymentTypeId { get; set; }
        public string PaymentTypeDescription { get; set; }

        public virtual ICollection<SalePaymentType> SalePaymentType { get; set; }
    }
}