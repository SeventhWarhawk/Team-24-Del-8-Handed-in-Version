using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using static The_Food_Works_WebAPI.ViewModels.Delivery;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DeliveryController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("GetDeliveries")]
        public dynamic GetDeliveries()
        {
            var deliveries = db.Delivery.Include(zz => zz.Sale.Customer).Include(zz => zz.Sale.Customer.CustomerAddress).Include(zz => zz.Employee).ToList();

            return GetDynamicDeliveries(deliveries);
        }

        public List<dynamic> GetDynamicDeliveries(List<Delivery> deliveries)
        {
            var dynamicDeliveries = new List<dynamic>();

            foreach (var delivery in deliveries)
            {
                dynamic dynamicDelivery = new ExpandoObject();
                dynamicDelivery.deliveryID = delivery.DeliveryId;
                dynamicDelivery.saleID = delivery.SaleId;
                dynamicDelivery.customerFullName = delivery.Sale.Customer.CustomerName + " " + delivery.Sale.Customer.CustomerSurname;
                dynamicDelivery.address = delivery.Sale.Customer.CustomerAddress.Select(zz => string.Format("{0} {1} {2}", zz.AddressStreetNum, zz.AddressStreetName, zz.AddressCity));

                dynamicDeliveries.Add(dynamicDelivery);
            }

            return dynamicDeliveries;
        }

        [HttpGet]
        [Route("GetViewDelivery/{deliveryID}")]
        public dynamic GetViewDelivery([FromRoute] int deliveryID)
        {
            var delivery = db.Delivery.Include(zz => zz.Sale.Customer).Where(zz => zz.DeliveryId == deliveryID).First();

            ViewDeliveryVM viewDelivery = new ViewDeliveryVM()
            {
                deliveryID = delivery.DeliveryId,
                saleID = delivery.SaleId,
                customerFullName = delivery.Sale.Customer.CustomerName + " " + delivery.Sale.Customer.CustomerSurname,
                customerTelephone = delivery.Sale.Customer.CustomerTelephone,
                customerSignature = delivery.CustomerSignOff
            };

            return viewDelivery;
        }

        [HttpGet]
        [Route("GetPendingDeliveries")]
        public dynamic GetPendingDeliveries()
        {
            var pendingDeliveries = db.Delivery.Include(zz => zz.Sale.Customer.CustomerAddress).Where(zz => zz.IsPending == false && zz.Sale.SaleStatusId != 3 && zz.Sale.SaleStatusId == 4).ToList();

            return GetDynamicPendingDeliveries(pendingDeliveries);
        }

        public List<dynamic> GetDynamicPendingDeliveries(List<Delivery> pendingDeliveries)
        {
            var dynamicPendingDeliveries = new List<dynamic>();

            foreach (var delivery in pendingDeliveries)
            {
                dynamic dynamicPendingDelivery = new ExpandoObject();
                dynamicPendingDelivery.deliveryID = delivery.DeliveryId;
                dynamicPendingDelivery.address = delivery.Sale.Customer.CustomerAddress.Select(zz => string.Format("{0} {1} {2}", zz.AddressStreetNum, zz.AddressStreetName, zz.AddressCity));
                dynamicPendingDelivery.postalCode = delivery.Sale.Customer.CustomerAddress.Select(zz => zz.AddressPostalCode);

                dynamicPendingDeliveries.Add(dynamicPendingDelivery);
            }

            return dynamicPendingDeliveries;
        }

        [HttpGet]
        [Route("GetDrivers")]
        public dynamic GetDrivers()
        {
            var drivers = db.User.Include(zz => zz.Employee).Where(zz => zz.UserRoleId == 4).ToList();

            return GetDynamicDrivers(drivers);
        }

        public List<dynamic> GetDynamicDrivers(List<User> drivers)
        {
            var dynamicDrivers = new List<dynamic>();

            foreach (var driver in drivers)
            {
                dynamic dynamicDriver = new ExpandoObject();
                dynamicDriver.employeeID = driver.Employee.EmployeeId;
                dynamicDriver.driverName = driver.Employee.EmployeeName;
                dynamicDriver.driverSurname = driver.Employee.EmployeeSurname;
                dynamicDriver.driverTelephone = driver.Employee.EmployeeTelephone;

                dynamicDrivers.Add(dynamicDriver);
            }

            return dynamicDrivers;
        }

        [HttpPost]
        [Route("GeneratePendingDeliveries")]
        public dynamic GeneratePendingDeliveries([FromBody] PendingDeliveryVM[] data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                foreach (var driver in data)
                {
                    var employeeID = driver.driver.Split(" - ")[0].Split(" ")[2];

                    foreach (var delivery in driver.splitDeliveries)
                    {
                        var deliveryString = Convert.ToString(delivery.address);
                        var deliveryID = deliveryString.Split(" - ")[0].Split(" ")[2];

                        int IDInt = Convert.ToInt32(deliveryID);

                        var deliveryToUpdate = db.Delivery.Where(zz => zz.DeliveryId == IDInt).First();

                        deliveryToUpdate.IsPending = true;
                        deliveryToUpdate.EmployeeId = Convert.ToInt32(employeeID);

                        db.SaveChanges();
                    }
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("GetRoute")]
        public dynamic GetRoute([FromBody] int driverID)
        {
            var routeDestinations = db.Delivery.Include(zz => zz.Sale).ThenInclude(zz => zz.Customer).ThenInclude(zz => zz.CustomerAddress).Where(zz => zz.EmployeeId == driverID && zz.IsPending == true).ToList();

            return GetDynamicRoute(routeDestinations);
        }

        public List<dynamic> GetDynamicRoute(List<Delivery> routeDestinations)
        {
            var dynamicDestinations = new List<dynamic>();

            foreach (var destination in routeDestinations)
            {
                dynamic dynamicDestination = new ExpandoObject();
                dynamicDestination.saleID = destination.SaleId;
                dynamicDestination.lat = destination.Sale.Customer.CustomerAddress.Select(zz => zz.AddressLat).First();
                dynamicDestination.lng = destination.Sale.Customer.CustomerAddress.Select(zz => zz.AddressLng).First();
                dynamicDestination.address = destination.Sale.Customer.CustomerAddress.Select(zz => string.Format("{0} {1} {2}", zz.AddressStreetNum, zz.AddressStreetName, zz.AddressCity));

                dynamicDestinations.Add(dynamicDestination);
            }

            return dynamicDestinations;
        }

        [HttpPost]
        [Route("GetCompleteInfo")]
        public dynamic GetCompleteInfo([FromBody] int saleID)
        {
            var delivery = db.Delivery.Include(zz => zz.Sale).ThenInclude(zz => zz.Customer).Where(zz => zz.SaleId == saleID).First();

            CompleteInfoVM completeInfo = new CompleteInfoVM()
            {
                saleID = delivery.SaleId,
                customerFullName = delivery.Sale.Customer.CustomerName + " " + delivery.Sale.Customer.CustomerSurname,
                customerTelephone = delivery.Sale.Customer.CustomerTelephone
            };

            return completeInfo;
        }

        [HttpPost]
        [Route("CompleteDelivery")]
        public dynamic CompleteDelivery([FromBody] CompleteDeliveryVM data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string emailAddress = db.Sale.Where(zz => zz.SaleId == data.saleID).Select(zz => zz.Customer.CustomerEmail).First();
                var deliveryDate = DateTime.Now.ToLongDateString();
                string deliveryAddress = db.Sale.Include(zz => zz.Customer.CustomerAddress).Where(zz => zz.SaleId == data.saleID).Select(zz => zz.Customer.CustomerAddress.Select(zz => string.Format("{0} {1} {2}", zz.AddressStreetNum, zz.AddressStreetName, zz.AddressCity)).First()).First().ToString();
                string subject = "The Food Works Delivery Completed || " + deliveryDate;
                string body;

                Assembly asm = Assembly.GetExecutingAssembly();
                string resourceName = asm.GetManifestResourceNames().Single(str => str.EndsWith("delivery-template.html"));
                using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
                {
                    TextReader tr = new StreamReader(stream);
                    body = tr.ReadToEnd();
                }

                body = body.Replace("**titleHeading**", "Delivery Notification").Replace("**subheading**", "Delivery Completion")
                    .Replace("**bodyText**", "Your order number " + data.saleID + " was delivered to: " + deliveryAddress + " on " + deliveryDate + "." + "<br>" + "<br>" + "Thank you for doing business with us. Bon Appétit :)");

                new EmailSender().SendEmailAsync(emailAddress, subject, body);

                var deliveryToComplete = db.Delivery.Where(zz => zz.SaleId == data.saleID).First();

                deliveryToComplete.CustomerSignOff = data.signature;
                deliveryToComplete.IsPending = false;
                deliveryToComplete.DeliveryDate = DateTime.Now;

                var orderToComplete = db.Sale.Where(zz => zz.SaleId == data.saleID).First();
                orderToComplete.SaleStatusId = 3;

                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("ReturnDelivery")]
        public dynamic ReturnDelivery([FromBody] int saleID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string emailAddress = db.Sale.Where(zz => zz.SaleId == saleID).Select(zz => zz.Customer.CustomerEmail).First();
                var deliveryDate = DateTime.Now.ToLongDateString();
                string subject = "The Food Works Delivery Returned || " + deliveryDate;
                string body;

                Assembly asm = Assembly.GetExecutingAssembly();
                string resourceName = asm.GetManifestResourceNames().Single(str => str.EndsWith("delivery-template.html"));
                using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
                {
                    TextReader tr = new StreamReader(stream);
                    body = tr.ReadToEnd();
                }

                body = body.Replace("**titleHeading**", "Delivery Notification").Replace("**subheading**", "Delivery Returned")
                    .Replace("**bodyText**", "Your order number " + saleID + " was returned to The Food Works on " + deliveryDate + " due to unforseen circumstances." + "<br>" + "<br>" + "We apologize for any inconvenience caused.");

                new EmailSender().SendEmailAsync(emailAddress, subject, body);

                var deliveryToReturn = db.Delivery.Where(zz => zz.SaleId == saleID).First();

                deliveryToReturn.IsPending = false;

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