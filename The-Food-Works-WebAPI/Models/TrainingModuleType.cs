// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class TrainingModuleType
    {
        public TrainingModuleType()
        {
            TrainingModule = new HashSet<TrainingModule>();
        }

        public int TrainingModuleTypeId { get; set; }
        public string TrainingModuleTypeDescription { get; set; }

        public virtual ICollection<TrainingModule> TrainingModule { get; set; }
    }
}