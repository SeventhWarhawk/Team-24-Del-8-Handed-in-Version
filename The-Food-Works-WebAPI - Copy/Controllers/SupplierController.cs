using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using System.Data;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;
using System.Web;
using Microsoft.Extensions.Logging;
using System.Configuration;
using The_Food_Works_WebAPI.ViewModels;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //ADD SUPPLIER SECTION

        // Get supplier types
        [HttpGet]
        [Route("GetTypes")]
        public List<dynamic> getSupplierTypes()
        {
            var supplierTypes = db.SupplierType.ToList();

            return GetDynamicSupplierTypes(supplierTypes);
        }

        public List<dynamic> GetDynamicSupplierTypes(List<SupplierType> supplierTypes)
        {
            var dynamicSupplierTypes = new List<dynamic>();

            foreach (var supplierType in supplierTypes)
            {
                dynamic dynamicsupplierType = new ExpandoObject();
                dynamicsupplierType.SupplierTypeId = supplierType.SupplierTypeId;
                dynamicsupplierType.SupplierTypeName = supplierType.SupplierTypeName;

                dynamicSupplierTypes.Add(dynamicsupplierType);
            }

            return dynamicSupplierTypes;
        }

        // Get order methods
        [HttpGet]
        [Route("GetOrderMethods")]
        public List<dynamic> getOrderMethods()
        {
            var orderMethods = db.OrderMethod.ToList();

            return GetDynamicOrderMethods(orderMethods);
        }

        public List<dynamic> GetDynamicOrderMethods(List<OrderMethod> orderMethods)
        {
            var dynamicOrderMethods = new List<dynamic>();

            foreach (var orderMethod in orderMethods)
            {
                dynamic dynamicOrderMethod = new ExpandoObject();
                dynamicOrderMethod.OrderMethodId = orderMethod.OrderMethodId;
                dynamicOrderMethod.OrderMethodName = orderMethod.OrderMethodName;

                dynamicOrderMethods.Add(dynamicOrderMethod);
            }

            return dynamicOrderMethods;
        }

        
        // Get statuses
        [HttpGet]
        [Route("GetStatuses")]
        public List<dynamic> getStatuses()
        {
            var statuses = db.SupplierStatus.ToList();

            return GetDynamicStatuses(statuses);
        }

        public List<dynamic> GetDynamicStatuses(List<SupplierStatus> statuses)
        {
            var dynamicStatuses = new List<dynamic>();

            foreach (var status in statuses)
            {
                dynamic dynamicStatus = new ExpandoObject();
                dynamicStatus.SupplierStatusId = status.SupplierStatusId;
                dynamicStatus.SupplierStatusName = status.SupplierStatusName;

                dynamicStatuses.Add(dynamicStatus);
            }

            return dynamicStatuses;
        }




        //Helper function
        private bool SupplierExists(string supplierName)
        {
            //db.Configuration.ProxyCreationEnabled = false;
            var supplier = db.Supplier.Where(zz => zz.SupplierName == supplierName).FirstOrDefault();

            return supplier != null;
        }

        //Search for all suppliers section
        //[ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpGet]
        [Route("GetSuppliers")]
        public List<dynamic> getSuppliers()
        {

                var suppliers = db.SupplierOrderDay.Include(x=>x.Supplier).Include(x=>x.Supplier.SupplierType).Include(x => x.Supplier.SupplierStatus).Include(x => x.Supplier.OrderMethod).Include(x=>x.Supplier.OrderMethod).ToList();

                return testSuppliers(suppliers);
    
        }

        public List<dynamic> testSuppliers(List<SupplierOrderDay> suppliers)
        {
            List<dynamic> dynamicSuppliers = new List<dynamic>();

            var supplierGroup = suppliers.GroupBy(x => new
            {
                x.SupplierId,
                x.Supplier.SupplierName,
                x.Supplier.SupplierVatNumber,
                x.Supplier.SupplierContactNumber,
                x.Supplier.SupplierEmailAddress,
                x.Supplier.OrderMethod.OrderMethodName,
                x.Supplier.SupplierStatus.SupplierStatusName,
                x.Supplier.SupplierStatus.SupplierStatusId,
                x.Supplier.SupplierType.SupplierTypeName,
            });

            foreach (var supplierG in supplierGroup)
            {
                dynamic dynamicSupplier = new ExpandoObject();
                dynamicSupplier.SupplierId = supplierG.Key.SupplierId;
                dynamicSupplier.SupplierName = supplierG.Key.SupplierName;
                dynamicSupplier.SupplierVatNumber = supplierG.Key.SupplierVatNumber;
                dynamicSupplier.SupplierContactNumber = supplierG.Key.SupplierContactNumber;
                dynamicSupplier.SupplierEmailAddress = supplierG.Key.SupplierEmailAddress;
                dynamicSupplier.OrderMethodName = supplierG.Key.OrderMethodName;
                dynamicSupplier.SupplierStatusName = supplierG.Key.SupplierStatusName;
                dynamicSupplier.SupplierStatusId = supplierG.Key.SupplierStatusId;
                dynamicSupplier.SupplierTypeName = supplierG.Key.SupplierTypeName;

                List<dynamic> dayList = new List<dynamic>();
                foreach (var day in supplierG.GroupBy(x => new { x.SupplierOrderId, x.SupplierOrderDayDescription }))
                {
                    dynamic orderDay = new ExpandoObject();
                    orderDay.SupplierOrderDayDescription = day.Key.SupplierOrderDayDescription;

                    dayList.Add(orderDay);
                }

                dynamicSupplier.orderDays = dayList;

                dynamicSuppliers.Add(dynamicSupplier);
            }


            return dynamicSuppliers;
        }
        public List<dynamic> getDynamicSuppliers(List<Supplier> suppliers, string orderDay)
        {
            var dynamicSuppliers = new List<dynamic>();
            foreach (var supplier in suppliers)
            {
                dynamic dynamicSupplier = new ExpandoObject();
                dynamicSupplier.SupplierId = supplier.SupplierId;
                dynamicSupplier.SupplierName = supplier.SupplierName;
                dynamicSupplier.SupplierVatNumber = supplier.SupplierVatNumber;
                dynamicSupplier.SupplierContactNumber = supplier.SupplierContactNumber;
                dynamicSupplier.SupplierEmailAddress = supplier.SupplierEmailAddress;
                dynamicSupplier.orderDay = orderDay;

                dynamicSupplier.OrderMethodName = supplier.OrderMethod.OrderMethodName;

                dynamicSuppliers.Add(dynamicSupplier);

            }

            return dynamicSuppliers;
        }


        //ADD SUPPLIER
        [HttpPost]
        [Route("AddSupplier")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult addSupplier([FromBody] SupplierVM supplier)
        {
            try
            {
                //check if VAT number already exists
                var check = db.Supplier.Where(zz => zz.SupplierVatNumber == supplier.SupplierVatNumber || zz.SupplierContactNumber == supplier.SupplierContactNumber).FirstOrDefault();

                if (check != null)
                {
                    return BadRequest();
                }
                else
                {
                    
                    int supplierId = db.Supplier.Max(x => x.SupplierId);
                    var newSupplier = new Supplier
                    {
                        SupplierId = supplierId + 1,
                        SupplierName = supplier.SupplierName,
                        SupplierContactNumber = supplier.SupplierContactNumber,
                        SupplierVatNumber = supplier.SupplierVatNumber,
                        SupplierEmailAddress = supplier.SupplierEmailAddress,
                        SupplierTypeId = supplier.SupplierTypeID,
                        SupplierStatusId = 1,
                        OrderMethodId = supplier.OrderMethodID,
                    };


                    db.Supplier.Add(newSupplier);
                    db.SaveChanges();


                    var daysToAdd = supplier.days;
                    for (int i = 0; i < daysToAdd.Count(); i++)
                    {
                        int supplierOrderDayid = db.SupplierOrderDay.Max(x => x.SupplierOrderId);
                        var newDays = new SupplierOrderDay
                        {
                            SupplierOrderId = supplierOrderDayid + 1,
                            SupplierId = supplierId + 1,
                            SupplierOrderDayDescription = daysToAdd[i]
                        };

                        db.SupplierOrderDay.Add(newDays);
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
        [Route("FindSupplier")]
        // [services.ClaimRequirement("Permission", "Admin")]
        public SupplierVM FindSupplier(SupplierVM id)
        {
            var supp = db.Supplier.Where(x => x.SupplierId == id.SupplierId).FirstOrDefault();
            SupplierVM newSupplier = new SupplierVM();
            newSupplier.SupplierId = supp.SupplierId;
            newSupplier.SupplierName = supp.SupplierName;
            newSupplier.SupplierVatNumber = supp.SupplierVatNumber;
            newSupplier.OrderMethodID = supp.OrderMethodId;
            newSupplier.SupplierEmailAddress = supp.SupplierEmailAddress;
            newSupplier.SupplierContactNumber = supp.SupplierContactNumber;
            newSupplier.SupplierTypeID = supp.SupplierTypeId;
            newSupplier.SupplierStatusID = supp.SupplierStatusId;

            var orderDays = db.SupplierOrderDay.Where(x => x.SupplierId == id.SupplierId).Select(x=>x.SupplierOrderDayDescription).ToList();

                string[] d = new string[orderDays.Count];
                for (int i = 0; i < orderDays.Count; i++)
                {
                    d[i] = orderDays[i];
                }
                newSupplier.days = d;


            return newSupplier;
        }

        [HttpPost]
        [Route("UpdateSupplier")]
        [ServiceFilter(typeof(AuditFilterAttribute))]

        public ActionResult UpdateSupplier(SupplierVM updatedSupplier)
        {

            if (updatedSupplier.days.Count() != 0)
            {
                try
                {
                    var supplierToUpdate = db.Supplier.Where(x => x.SupplierId == updatedSupplier.SupplierId).FirstOrDefault();

                    supplierToUpdate.SupplierName = updatedSupplier.SupplierName;
                    supplierToUpdate.SupplierVatNumber = updatedSupplier.SupplierVatNumber;
                    supplierToUpdate.SupplierContactNumber = updatedSupplier.SupplierContactNumber;
                    supplierToUpdate.SupplierEmailAddress = updatedSupplier.SupplierEmailAddress;
                    supplierToUpdate.OrderMethodId = updatedSupplier.OrderMethodID;
                    supplierToUpdate.SupplierStatusId = (int)updatedSupplier.SupplierStatusID;
                    supplierToUpdate.SupplierTypeId = updatedSupplier.SupplierTypeID;

                    var ordersToAdd = updatedSupplier.days;
                    var currentDays = db.SupplierOrderDay.Where(x => x.SupplierId == updatedSupplier.SupplierId).ToList();

                    for (int i = 0; i < currentDays.Count(); i++)
                    {
                        db.Remove(currentDays[i]);

                        db.SaveChanges();
                    }

                    var daysToAdd = updatedSupplier.days;
                    for (int i = 0; i < daysToAdd.Count(); i++)
                    {
                        int supplierOrderDayid = db.SupplierOrderDay.Max(x => x.SupplierOrderId);
                        var newDays = new SupplierOrderDay
                        {
                            SupplierOrderId = supplierOrderDayid + 1,
                            SupplierId = (int)updatedSupplier.SupplierId,
                            SupplierOrderDayDescription = daysToAdd[i]
                        };

                        db.SupplierOrderDay.Add(newDays);

                        db.SaveChanges();
                    }

                    db.SaveChanges();
                    return Ok();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
            else
                return BadRequest();
        }

        
        [HttpPost]
        [Route("DeleteSupplier")]
        [ServiceFilter(typeof(AuditFilterAttribute))]

        public ActionResult deleteSupplier(SupplierVM deleteSupplier)
        {

            try
            {

                var orderDayDelete = db.SupplierOrderDay.Where(x => x.SupplierId == deleteSupplier.SupplierId).ToList();

                for (int i = 0; i < orderDayDelete.Count(); i++)
                {
                    db.Remove(orderDayDelete[i]);
                }

                var toDelete = db.Supplier.Where(x => x.SupplierId == deleteSupplier.SupplierId).FirstOrDefault();
                db.Supplier.Remove(toDelete);

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
