using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public partial class EmployeeTrainingVM
    {
        public EmployeeTrainingVM() { }
        public int TrainingModuleId { get; set; }
        public int EmployeeId { get; set; }      
        public string EmployeeName { get; set; }
        public string EmployeeSurname { get; set; }
        public string EmployeeIdNumber { get; set; }
        public string EmployeeTelephone { get; set; }
        public string EmployeeEmail { get; set; }  
        public TimeSpan TimeElapsed { get; set; }
        public bool EmployeeTrainingModuleStatus { get; set; }
        public DateTime DateCompleted { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public int? UserRoleId { get; set; }
        public int? UserStatus { get; set; }
        public int UserID { get; set; }
        public List<string> moduleNames { get; set; }
    }

   
}
