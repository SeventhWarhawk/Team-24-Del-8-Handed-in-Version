﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class BatchStatus
    {
        public BatchStatus()
        {
            Batch = new HashSet<Batch>();
        }

        public int BatchStatusId { get; set; }
        public string BatchStatusName { get; set; }

        public virtual ICollection<Batch> Batch { get; set; }
    }
}