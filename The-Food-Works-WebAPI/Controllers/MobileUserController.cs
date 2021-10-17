using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using static The_Food_Works_WebAPI.ViewModels.Data;
using System.Dynamic;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using The_Food_Works_WebAPI.services;
using Microsoft.AspNetCore.Cors;
using static The_Food_Works_WebAPI.ViewModels.GlobalVariables;
using static The_Food_Works_WebAPI.ViewModels.MobileUser;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileUserController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        private readonly IJwtAuthenticationManager jwtAuthenticationManager;

        public MobileUserController(IJwtAuthenticationManager jwtAuthenticationManager)
        {
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }

        [HttpPost]
        [Route("Login")]
        public ActionResult Login([FromBody] AuthVM vm)
        {
            string hashedPassword = services.GenPointSecurity.ComputeSha256Hash(vm.Password);
            AuthResponseVM response = new AuthResponseVM();

            var user = db.User
                .Include(zz => zz.UserRole)
                .Include(zz => zz.Customer)
                .Include(zz => zz.Employee)
                .Where(zz => zz.UserUsername.ToUpper() == vm.EmailAddress.ToUpper() && zz.UserPassword == hashedPassword)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }

            if (user.UserStatusId == 2)
            {
                return Forbid();
            }

            //JWT token management
            var mobileToken = jwtAuthenticationManager.Authenticate(vm.EmailAddress, hashedPassword);
            if (mobileToken == null)
            {
                return Unauthorized();
            }

            if (user.UserRoleId == 3 || user.UserRoleId == 4)
            {
                var userID = "";
                var displayName = "";
                if (user.UserRoleId == 3)
                {
                    userID = user.CustomerId.ToString();
                    displayName = string.Format("{0} {1}", user.Customer.CustomerName, user.Customer.CustomerSurname);
                }
                else if (user.UserRoleId == 4)
                {
                    userID = user.EmployeeId.ToString();
                    displayName = string.Format("{0} {1}", user.Employee.EmployeeName, user.Employee.EmployeeSurname);
                }

                response.userID = userID;
                response.displayName = displayName;
                response.token = mobileToken;
                response.expiresIn = "3600";
                response.userRole = user.UserRole.UserRoleName;
            }
            else
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}