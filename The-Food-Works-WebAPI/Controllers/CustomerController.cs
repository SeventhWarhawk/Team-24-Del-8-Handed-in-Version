using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using static The_Food_Works_WebAPI.ViewModels.Data;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpPost]
        [Route("RegisterCustomer")]
        public ActionResult Register([FromBody] CustomerVM vm)
        {
            if (UserExists(vm.CustomerEmail, vm.CustomerTelephone))
            {
                return Forbid();
            }

            try
            {
                var newCustomer = new Customer
                {
                    CustomerName = vm.CustomerName,
                    CustomerSurname = vm.CustomerSurname,
                    CustomerDob = vm.CustomerDob,
                    CustomerTelephone = vm.CustomerTelephone,
                    CustomerEmail = vm.CustomerEmail,
                    IsLoyaltyProgram = vm.IsLoyaltyProgram,
                };
                db.Customer.Add(newCustomer);
                db.SaveChanges();

                var newUser = new User
                {
                    UserUsername = vm.CustomerEmail,
                    UserPassword = GenPointSecurity.ComputeSha256Hash(vm.Password),
                    UserRoleId = 3,
                    UserStatusId = 1,
                    Customer = newCustomer
                };

                db.User.Add(newUser);
                db.SaveChanges();

                string test = vm.City;

                var newAddress = new CustomerAddress
                {
                    CustomerId = db.Customer.Max(zz => zz.CustomerId),
                    AddressStreetNum = vm.StreetNumber,
                    AddressStreetName = vm.StreetName,
                    AddressCity = vm.City,
                    AddressPostalCode = vm.PostalCode,
                    AddressProvince = vm.Province,
                    AddressDate = DateTime.Now,
                    AddressLat = (double)vm.Lat,
                    AddressLng = (double)vm.Lng
                };

                db.CustomerAddress.Add(newAddress);
                db.SaveChanges();

                string hashedPassword = newUser.UserPassword;
                var callbackUrl = Url.Action("VerifyEmail", "User", new { key = hashedPassword }, protocol: HttpContext.Request.Scheme);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Helper functions
        private bool UserExists(string EmailAddress, string TelephoneNumber)
        {
            var user = db.Customer.Where(zz => zz.CustomerEmail == EmailAddress || zz.CustomerTelephone == TelephoneNumber).FirstOrDefault();

            if (user != null)
            {
                return true;
            }

            return false;
        }

        private string ComputeSha256Hash(string rawData)
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

        [HttpGet]
        [Route("GetCustomerToUpdate/{customerID}")]
        public dynamic GetCustomerToUpdate([FromRoute] int customerID)
        {
            var customerToUpdate = db.Customer.Where(zz => zz.CustomerId == customerID).First();

            var addressToUpdate = db.CustomerAddress.Where(zz => zz.CustomerId == customerToUpdate.CustomerId).FirstOrDefault();

            CustomerVM customer = new CustomerVM
            {
                CustomerName = customerToUpdate.CustomerName,
                CustomerSurname = customerToUpdate.CustomerSurname,
                CustomerTelephone = customerToUpdate.CustomerTelephone,
                CustomerEmail = customerToUpdate.CustomerEmail,
                IsLoyaltyProgram = customerToUpdate.IsLoyaltyProgram,
                StreetNumber = addressToUpdate.AddressStreetNum,
                StreetName = addressToUpdate.AddressStreetName,
                City = addressToUpdate.AddressCity,
                PostalCode = addressToUpdate.AddressPostalCode,
                Province = addressToUpdate.AddressProvince,
                Lat = (float?)addressToUpdate.AddressLat,
                Lng = (float?)addressToUpdate.AddressLng
            };

            return customer;
        }

        [HttpPost]
        [Route("UpdateCustomer")]
        public ActionResult UpdateCustomer([FromBody] CustomerVM vm)
        {
            try
            {
                var cust = db.Customer.Where(zz => zz.CustomerId == vm.CustomerID).FirstOrDefault();
                cust.CustomerName = vm.CustomerName;
                cust.CustomerSurname = vm.CustomerSurname;
                cust.CustomerTelephone = vm.CustomerTelephone;
                cust.CustomerDob = vm.CustomerDob;
                cust.IsLoyaltyProgram = vm.IsLoyaltyProgram;

                var address = db.CustomerAddress.Where(zz => zz.CustomerId == cust.CustomerId).FirstOrDefault();
                address.AddressStreetNum = vm.StreetNumber;
                address.AddressStreetName = vm.StreetName;
                address.AddressCity = vm.City;
                address.AddressPostalCode = vm.PostalCode;
                address.AddressProvince = vm.Province;
                address.AddressLat = (double)vm.Lat;
                address.AddressLng = (double)vm.Lng;

                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllCustomers")]
        public List<dynamic> getAllCustomers()
        {
            var customers = db.Customer.OrderBy(x => x.CustomerName).ToList();
            return getDynamicCustomers(customers);
        }

        public List<dynamic> getDynamicCustomers(List<Customer> customers)
        {
            var dynamicCustomers = new List<dynamic>();

            foreach (var customer in customers)
            {
                dynamic dynamicCustomer = new ExpandoObject();
                dynamicCustomer.CustomerId = customer.CustomerId;
                dynamicCustomer.CustomerName = customer.CustomerName;
                dynamicCustomer.CustomerSurname = customer.CustomerSurname;
                dynamicCustomer.CustomerDob = customer.CustomerDob;
                dynamicCustomer.CustomerTelephone = customer.CustomerTelephone;
                dynamicCustomer.CustomerEmail = customer.CustomerEmail;
                dynamicCustomer.IsLoyaltyProgram = customer.IsLoyaltyProgram;

                dynamicCustomers.Add(dynamicCustomer);
            }

            return dynamicCustomers;
        }

        [HttpPost]
        [Route("DeactivateCustomer")]
        public dynamic DeactivateCustomer([FromBody] int customerID)
        {
            try
            {
                var pendingSale = db.Sale.Where(zz => zz.CustomerId == customerID && zz.SaleStatusId != 3).FirstOrDefault();

                if (pendingSale == null)
                {
                    var user = db.User.Where(zz => zz.CustomerId == customerID).FirstOrDefault();

                    user.UserStatusId = 2;

                    db.SaveChanges();

                    return Ok();
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}