﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class Voucher
    {
        public Voucher()
        {
            RedeemedInstance = new HashSet<RedeemedInstance>();
        }

        public int VoucherId { get; set; }
        public string VoucherCode { get; set; }
        public bool VoucherStatus { get; set; }
        public DateTime VoucherExpiryDate { get; set; }
        public double VoucherAmount { get; set; }
        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual ICollection<RedeemedInstance> RedeemedInstance { get; set; }
    }
}