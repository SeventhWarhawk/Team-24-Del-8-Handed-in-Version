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
using System.Reflection;
using System.IO;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpPost]
        [Route("Login")]
        public ActionResult Login(AuthVM vm)
        {
            string hashedPassword = services.GenPointSecurity.ComputeSha256Hash(vm.Password);
            UserInfoVM uVM = new UserInfoVM();

            var user = db.User
                .Include(u => u.UserRole)
                .Where(zz => zz.UserUsername.ToUpper() == vm.EmailAddress.ToUpper() && zz.UserPassword == hashedPassword)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }
            string token = "";
            //add the Employee role so that you can decorate actions with either "Employee" permission or "Cashier"
            if (user.EmployeeId != null)
            {
                token = MySecurityToken.GenerateToken(user.UserId, new string[] { "Employee", user.UserRole.UserRoleName });
                Employee employee = db.Employee.Where(x => x.EmployeeId == user.EmployeeId).FirstOrDefault();
                uVM.BranchId = vm.BranchId;
                Branch branch = db.Branch.Where(x => x.BranchId == uVM.BranchId).FirstOrDefault();
                uVM.BranchName = branch.BranchName;
                uVM.EmployeeId = user.EmployeeId;
                uVM.DisplayName = String.Format("{0} {1}", employee.EmployeeName, employee.EmployeeSurname);
                uVM.FirstName = employee.EmployeeName;
                uVM.EmailAddress = user.UserUsername;
                uVM.Roles = user.UserRole.UserRoleDescription.Split(",");
            }
            else if (user.CustomerId != null)
            {
                return Unauthorized();
            }
            HttpContext.Response.Cookies.Append("access_token", token, new CookieOptions { Secure = false, HttpOnly = false });
            HttpContext.Response.Cookies.Append("test1", token, new CookieOptions { Secure = false, HttpOnly = true });
            HttpContext.Response.Cookies.Append("test2", token, new CookieOptions { Domain = "localhost" });
            MyGlobalVariable = uVM;
            return Ok(uVM);
        }

        [HttpGet]
        [Route("LogOut")]
        public IActionResult LogOut()
        {
            try
            {
                HttpContext.Response.Cookies.Append("access_token", "", new CookieOptions { HttpOnly = true });
                MyGlobalVariable = null;
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [HttpGet]
        [Route("fakeToken")]
        public IActionResult fakeToken()
        {
            string token = MySecurityToken.GenerateToken(1, new string[] { "Customer" });
            HttpContext.Response.Cookies.Append("access_token", token, new CookieOptions { HttpOnly = true });
            return Ok(token);
        }

        [services.ClaimRequirement("Permission", "Cashier")]
        [HttpGet]
        [Route("test")]
        public IActionResult test()
        {
            return Ok();
        }

        [services.ClaimRequirement("Permission", "Employee")]
        [HttpGet]
        [Route("test2")]
        public IActionResult test2()
        {
            return Ok();
        }

        //OTP Generator
        public int GenerateRandomNo()
        {
            int _min = 1000;
            int _max = 9999;
            Random _rdm = new Random();
            return _rdm.Next(_min, _max);
        }

        [HttpGet]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        [Route("VerifyEmail")]
        public ActionResult VerifyEmail(String key)
        {
            try
            {
                var user = db.User.Where(z => z.UserPassword == key).FirstOrDefault();
                if (user != null)
                {
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // FORGOT PASSWORD EMAIL
        [HttpPost]
        [Route("ForgotPassword")]
        public ActionResult ForgotPassword(ForgotPasswordVM Email)
        {
            try
            {
                string email = Email.Email;
                var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == email).FirstOrDefault();
                if (getUser != null)
                {
                    getUser.OneTimePin = GenerateRandomNo();
                    db.SaveChanges();
                    String firstName;
                    if (getUser.CustomerId != null)
                    {
                        firstName = getUser.Customer.CustomerName;
                    }
                    else if (getUser.EmployeeId != null)
                    {
                        firstName = getUser.Employee.EmployeeName;
                    }
                    else
                    {
                        firstName = "user";
                    }
                    var subject = "Password Reset Request";

                    string body;

                    Assembly asm = Assembly.GetExecutingAssembly();
                    string resourceName = asm.GetManifestResourceNames().Single(str => str.EndsWith("forgot-password-otp.html"));
                    using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
                    {
                        TextReader tr = new StreamReader(stream);
                        body = tr.ReadToEnd();
                    }

                    body = body.Replace("**titleHeading**", "Want to reset your Password?").Replace("**subheading**", "Hello " + firstName + ",")
                        .Replace("**bodyText**", "You recently requested to reset the password to your account. <br/> Your unique One-Time-Pin to reset your password is: <br/><br/>" + getUser.OneTimePin +
                        "<br/><br/>If you did not request a password reset, please ignore this email or reply to let us know.<br/><br/> Thank you");

                    new EmailSender().SendEmailAsync(email, subject, body);

                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // CHECK FORGOT PASSWORD OTP
        [HttpPost]
        [Route("CheckOTP")]
        public ActionResult CheckOTP(OTPvm user)
        {
            var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == user.user).FirstOrDefault();
            // check if the email exists and if the OTP matches
            if (getUser != null && getUser.OneTimePin == user.OTP)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        // RESET USER PASSWORD
        [HttpPost]
        [Route("ResetPassword")]
        public ActionResult ResetPassword(ResetPasswordVM vm)
        {
            try
            {
                string email;
                if (vm.CustomerID != null)
                {
                    email = db.Customer.Where(zz => zz.CustomerId == vm.CustomerID).Select(zz => zz.CustomerEmail).First();
                }
                else
                {
                    email = vm.email;
                }
                var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == email).FirstOrDefault();
                string hashedPassword = GenPointSecurity.ComputeSha256Hash(vm.NewPassword);
                string currentPassword = GenPointSecurity.ComputeSha256Hash(vm.CurrentPassword);
                if (getUser != null && currentPassword == getUser.UserPassword)
                {
                    getUser.UserPassword = hashedPassword;

                    db.SaveChanges();

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // RESET USER PASSWORD
        [HttpPost]
        [Route("ResetForgottenPassword")]
        public ActionResult ResetForgottenPassword(ResetForgottenPasswordVM vm)
        {
            try
            {
                var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == vm.email).FirstOrDefault();
                string hashedPassword = GenPointSecurity.ComputeSha256Hash(vm.NewPassword);

                if (getUser != null)
                {
                    getUser.UserPassword = hashedPassword;

                    db.SaveChanges();

                    return Ok();
                }
                else
                {
                    return BadRequest("Incorrect Credentials");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Helper functions
        private bool UserExists(string EmailAddress)
        {
            var user = db.User.Where(zz => zz.UserUsername == EmailAddress).FirstOrDefault();

            return user != null;
        }

        public string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}