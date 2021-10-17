using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeUserVM : ControllerBase
    {

        public string EmployeeName { get; set; }
        public string EmployeeSurname { get; set; }
        public string EmployeeIdNumber { get; set; }
        public string EmployeeTelephone { get; set; }
        public string EmployeeEmail { get; set; }
        public int BranchId { get; set; }

        public string UserUsername { get; set; }
        public string UserPassword { get; set; }
        public int UserRoleId { get; set; }
    }


}
