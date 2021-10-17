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

//using Microsoft.EntityFrameworkCore.Proxies;
using System.Web;
using Microsoft.Extensions.Logging;
using static The_Food_Works_WebAPI.ViewModels.CustomerOrderData;
using System.Configuration;
using static The_Food_Works_WebAPI.ViewModels.CustomerOrder;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //SEARCH CUSTOMER ORDER SECTION
    public class CustomerOrderAdminController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("GetOrdersToPack")]
        public List<dynamic> GetOrdersToPack()
        {
            var orders = db.Sale.Include(zz => zz.Customer).Include(zz => zz.SaleStatus).Include(zz => zz.CompletionMethod).Include(zz => zz.Branch)
                .Include(zz => zz.SalePaymentType).ThenInclude(zz => zz.PaymentType).Where(zz => zz.SaleStatusId == 1).ToList();

            return GetDynamicOrdersToPack(orders);
        }

        public List<dynamic> GetDynamicOrdersToPack(List<Sale> orders)
        {
            var dynamicOrders = new List<dynamic>();

            foreach (var order in orders)
            {
                dynamic dynamicOrder = new ExpandoObject();
                dynamicOrder.saleID = order.SaleId;
                dynamicOrder.dateOfSale = order.DateOfSale.ToString("dd/MM/yyyy");
                dynamicOrder.customerName = string.Format("{0} {1}", order.Customer.CustomerName, order.Customer.CustomerSurname);
                dynamicOrder.customerTelephone = order.Customer.CustomerTelephone;
                dynamicOrder.saleStatus = order.SaleStatus.SaleStatusDescription;
                dynamicOrder.completionMethod = order.CompletionMethod.CompletionMethodDescription;
                dynamicOrder.branchName = order.Branch.BranchName;
                dynamicOrder.paymentType = order.SalePaymentType.Select(zz => zz.PaymentType.PaymentTypeDescription).First();

                dynamicOrders.Add(dynamicOrder);
            }

            return dynamicOrders;
        }

        [HttpGet]
        [Route("GetItemsToPack/{saleID}")]
        public List<dynamic> GetItemsToPack([FromRoute] int saleID)
        {
            var orderLines = db.SaleLine.Include(zz => zz.BranchProduct).ThenInclude(zz => zz.Product).Where(zz => zz.SaleId == saleID).ToList();

            return GetDynamicItemsToPack(orderLines);
        }

        public List<dynamic> GetDynamicItemsToPack(List<SaleLine> orderLines)
        {
            var dynamicOrders = new List<dynamic>();

            foreach (var orderLine in orderLines)
            {
                dynamic dynamicOrderLine = new ExpandoObject();
                dynamicOrderLine.saleID = orderLine.SaleId;
                dynamicOrderLine.barcode = orderLine.BranchProduct.Product.ProductBarcode;
                dynamicOrderLine.productName = orderLine.BranchProduct.Product.ProductName;
                dynamicOrderLine.quantity = orderLine.Quantity;
                dynamicOrderLine.packed = false;

                dynamicOrders.Add(dynamicOrderLine);
            }

            return dynamicOrders;
        }

        [HttpPost]
        [Route("PackOrder")]
        public dynamic DoReview([FromBody] int saleID)
        {
            try
            {
                var sale = db.Sale.Where(zz => zz.SaleId == saleID).First();

                sale.SaleStatusId = 4;

                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        [HttpGet]
        [Route("GetOrder/{saleID}")]
        public dynamic GetOrder([FromRoute] int saleID)
        {
            var checkStatus = db.Sale.Where(zz => zz.SaleId == saleID).Select(zz => zz.SaleStatusId).First();
            if (checkStatus == 3)
            {
                return Forbid();
            }

            var sale = db.Sale.Include(zz => zz.SaleStatus).Include(zz => zz.CompletionMethod).Include(zz => zz.SalePaymentType).ThenInclude(zz => zz.PaymentType).Include(zz => zz.SaleLine).ThenInclude(zz => zz.BranchProduct.Product).ThenInclude(zz => zz.BranchProduct).ThenInclude(zz => zz.ProductPrice).Where(zz => zz.SaleId == saleID).First();

            OrderVM order = new OrderVM();

            order.orderID = sale.SaleId;
            order.orderStatus = sale.SaleStatusId;
            order.orderDate = sale.DateOfSale;
            order.completionMethod = sale.CompletionMethod.CompletionMethodDescription;
            order.paymentMethod = sale.SalePaymentType.Select(zz => zz.PaymentType.PaymentTypeDescription).First();

            List<dynamic> orderLines = new List<dynamic>();
            foreach (var item in sale.SaleLine)
            {
                dynamic dynamicOrderLine = new ExpandoObject();
                dynamicOrderLine.productID = item.ProductId;
                dynamicOrderLine.productName = item.BranchProduct.Product.ProductName;
                dynamicOrderLine.quantity = item.Quantity;
                dynamicOrderLine.productPrice = item.BranchProduct.ProductPrice.Where(zz => zz.ProductId == item.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                orderLines.Add(dynamicOrderLine);
            }
            order.orderLines = orderLines;

            return order;
        }

        [HttpPost]
        [Route("MakePayment")]
        public dynamic MakePayment([FromBody] PaymentVM data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transact = db.Database.BeginTransaction())
                {
                    var paymentToRemove = db.SalePaymentType.Where(zz => zz.SaleId == data.saleID).First();

                    db.SalePaymentType.Remove(paymentToRemove);
                    db.SaveChanges();

                    SalePaymentType payment = new SalePaymentType();

                    payment.SaleId = data.saleID;
                    payment.PaymentTypeId = db.PaymentType.Where(zz => zz.PaymentTypeDescription == data.paymentType).Select(zz => zz.PaymentTypeId).First();
                    payment.AmountPaid = data.amount;

                    db.SalePaymentType.Add(payment);
                    db.SaveChanges();

                    transact.Commit();
                }

                CompleteOrder(data.saleID);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("CompleteOrder")]
        public dynamic CompleteOrder([FromBody] int orderID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var saleToComplete = db.Sale.Where(zz => zz.SaleId == orderID).First();

                saleToComplete.SaleStatusId = 3;

                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetCustomerDetails/{customerID}")]
        public dynamic GetCustomerDetails([FromRoute] int customerID)
        {
            var foundCustomer = db.Customer.Where(zz => zz.CustomerId == customerID).FirstOrDefault();

            CustomerVM customer = new CustomerVM();

            customer.customerName = foundCustomer.CustomerName;
            customer.customerSurname = foundCustomer.CustomerSurname;
            customer.customerEmail = foundCustomer.CustomerEmail;

            return customer;
        }
    }
}