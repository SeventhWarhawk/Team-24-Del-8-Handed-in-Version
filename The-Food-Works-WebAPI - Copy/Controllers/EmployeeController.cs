using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.ViewModels;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("GetAllEmployees")]

        public List<dynamic> getAllEmployees()
        {
            var employees = db.Employee.ToList();
            return getDynamicEmployees(employees);
        }

        public List<dynamic> getDynamicEmployees(List<Employee> employees)
        {
            var dynamicEmployees = new List<dynamic>();

            foreach (var employee in employees)
            {
                dynamic dynamicEmployee = new ExpandoObject();
                dynamicEmployee.EmployeeName = employee.EmployeeName;
                dynamicEmployee.EmployeeSurname = employee.EmployeeSurname;
                dynamicEmployee.EmployeeIdNumber = employee.EmployeeIdNumber;
                dynamicEmployee.EmployeeTelephone = employee.EmployeeTelephone;
                dynamicEmployee.EmployeeEmail = employee.EmployeeEmail;
                dynamicEmployee.BranchId = employee.BranchId;

                dynamicEmployees.Add(dynamicEmployee);
            }

            return dynamicEmployees;
        }


        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("WriteNewEmployee")]
        public ActionResult writeNewEmployee(EmployeeUserVM toAdd)
        {
            if (this.EmployeeEsists(toAdd.EmployeeIdNumber))
            {
                return Forbid();
            }

            try
            {
                var newEmployee = new Employee
                {
                    EmployeeName = toAdd.EmployeeName,
                    EmployeeSurname = toAdd.EmployeeSurname,
                    EmployeeIdNumber = toAdd.EmployeeIdNumber,
                    EmployeeTelephone = toAdd.EmployeeTelephone,
                    EmployeeEmail = toAdd.EmployeeEmail,
                    BranchId = toAdd.BranchId
                };
                db.Employee.Add(newEmployee);
                db.SaveChanges();

                var hashPassword = new UserController().ComputeSha256Hash(toAdd.UserPassword);

                var employeeID = db.Employee.Where(x => x.EmployeeIdNumber == toAdd.EmployeeIdNumber).Select(x => x.EmployeeId).FirstOrDefault();

                var newUser = new User
                {
                    UserUsername = toAdd.UserUsername,
                    OneTimePin = null,
                    UserRoleId = toAdd.UserRoleId,
                    UserPassword = hashPassword,
                    UserStatusId = 1,
                    EmployeeId = employeeID,
                };

                db.User.Add(newUser);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private bool EmployeeEsists(string ID)
        {
            var employee = db.Employee.Where(ee => ee.EmployeeIdNumber == ID).FirstOrDefault();

            return employee != null;
        }

        [HttpGet]
        [Route("GetBranches")]
        public List<dynamic> getBranches()
        {
            var branches = db.Branch.ToList();
            return getDynamicBranches(branches);
        }

        public List<dynamic> getDynamicBranches(List<Branch> branches)
        {
            var dynamicBranches = new List<dynamic>();

            foreach (var branch in branches)
            {
                dynamic dynamicBranch = new ExpandoObject();
                dynamicBranch.BranchId = branch.BranchId;
                dynamicBranch.BranchName = branch.BranchName;
                dynamicBranches.Add(dynamicBranch);
            }

            return dynamicBranches;
        }

        [HttpGet]
        [Route("GetUserRoles")]
        public List<dynamic> getUserRoles()
        {
            var userRoles = db.UserRole.ToList();
            return getDynamicUserRole(userRoles);
        }

        public List<dynamic> getDynamicUserRole(List<UserRole> userRoles)
        {
            var dynamicUserRoles = new List<dynamic>();

            foreach (var userRole in userRoles)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.UserRoleId = userRole.UserRoleId;
                dynamicUserRole.UserRoleName = userRole.UserRoleName;
                dynamicUserRoles.Add(dynamicUserRole);
            }

            return dynamicUserRoles;
        }

        [HttpGet]
        [Route("GetUserStatus")]
        public List<dynamic> getUserStatus()
        {
            var userStatus = db.UserStatus.ToList();
            return getDynamicUserStatus(userStatus);
        }

        public List<dynamic> getDynamicUserStatus(List<UserStatus> userStatus)
        {
            var dynamicUserStatuss = new List<dynamic>();

            foreach (var userstatus in userStatus)
            {
                dynamic dynamicUserStatus = new ExpandoObject();
                dynamicUserStatus.UserStatusId = userstatus.UserStatusId;
                dynamicUserStatus.UserDescription = userstatus.UserDescription;
                dynamicUserStatuss.Add(dynamicUserStatus);
            }

            return dynamicUserStatuss;
        }

        [HttpPost]
        [Route("GetEmployeeDetails")]
        public EmployeeTrainingVM getEmployeeDetails(Employee EmployeeIdNumber)
        {
            var employee = db.Employee.Where(x => x.EmployeeIdNumber == EmployeeIdNumber.EmployeeIdNumber).FirstOrDefault();
            var branch = db.Branch.Where(x => x.BranchId == employee.BranchId).FirstOrDefault();
            var trainingModules = db.EmployeeTrainingModule.Where(x => x.EmployeeId == employee.EmployeeId).ToList();
            var user = db.User.Where(x => x.EmployeeId == employee.EmployeeId).FirstOrDefault();
            List<string> moduleNames = new List<string>();
            foreach (var trainingModule in trainingModules)
            {
                string currentName = db.TrainingModule.Where(x => x.TrainingModuleId == trainingModule.TrainingModuleId).Select(x => x.ModuleName).FirstOrDefault().ToString();
                moduleNames.Add(currentName);
            }

            var employeeToDisplay = new EmployeeTrainingVM
            {
                EmployeeId = employee.EmployeeId,
                EmployeeName = employee.EmployeeName,
                EmployeeSurname = employee.EmployeeSurname,
                EmployeeIdNumber = employee.EmployeeIdNumber,
                EmployeeTelephone = employee.EmployeeTelephone,
                EmployeeEmail = employee.EmployeeEmail,
                BranchId = employee.BranchId,
                BranchName = branch.BranchName,
                moduleNames = moduleNames,
                UserRoleId = user.UserRoleId,
                UserStatus = user.UserStatusId,
                UserID = user.UserId,
            };
            return employeeToDisplay;
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("UpdateEmployee")]

        public ActionResult updateEmployee(Employee updatedEmployee)
        {
            try
            {
                var employeeToUpdate = db.Employee.Where(x => x.EmployeeIdNumber == updatedEmployee.EmployeeIdNumber).FirstOrDefault();

                employeeToUpdate.EmployeeName = updatedEmployee.EmployeeName;
                employeeToUpdate.EmployeeSurname = updatedEmployee.EmployeeSurname;
                employeeToUpdate.EmployeeTelephone = updatedEmployee.EmployeeTelephone;
                employeeToUpdate.EmployeeEmail = updatedEmployee.EmployeeEmail;
                employeeToUpdate.BranchId = updatedEmployee.BranchId;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("DeleteEmployee")]
        public ActionResult deleteEmployee(Employee toDeleteEmployee)
        {
            try
            {
                var employeeToDelete = db.Employee.Include(x => x.EmployeeTrainingModule).Include(x => x.Sale).Include(x => x.Delivery).Where(x => x.EmployeeIdNumber == toDeleteEmployee.EmployeeIdNumber).FirstOrDefault();
                var userToDelete = db.User.Where(x => x.EmployeeId == employeeToDelete.EmployeeId).FirstOrDefault();
                db.User.Remove(userToDelete);
                db.Employee.Remove(employeeToDelete);

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("UpdateUser")]

        public ActionResult updateUser(User updatedUser)
        {
            try
            {
                var userToUpdate = db.User.Where(x => x.UserId == updatedUser.UserId).FirstOrDefault();

                userToUpdate.UserRoleId = updatedUser.UserRoleId;
                userToUpdate.UserStatusId = updatedUser.UserStatusId;
                userToUpdate.UserUsername = updatedUser.UserUsername;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
