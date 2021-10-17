using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;
using static The_Food_Works_WebAPI.ViewModels.SaleVM;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SaleController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("GetAllSales")]
        public List<dynamic> getAllSales()
        {
            //var employees = db.Employee.ToList();
            var sales = db.Sale.ToList();
            return getDynamicSales(sales);
        }

        public List<dynamic> getDynamicSales(List<Sale> sales)
        {
            var dynamicSales = new List<dynamic>();

            foreach (var sale in sales)
            {
                dynamic dynamicSale = new ExpandoObject();
                dynamicSale.SaleID = sale.SaleId;
                dynamicSale.SaleDate = sale.DateOfSale;
                dynamicSale.saleTotal = sale.SaleTotal;

                dynamicSales.Add(dynamicSale);
            }

            return dynamicSales;
        }

        [HttpGet]
        [Route("GetProducts/{branchID}")]
        public List<dynamic> getProducts([FromRoute] int branchID)
        {
            var products = db.BranchProduct.Include(zz => zz.Product).Include(zz => zz.ProductPrice).Where(zz => zz.BranchId == branchID && zz.Product.ProductStatusId != 2)
                .OrderBy(zz => zz.Product.ProductName).ToList();
            return getDynamicProducts(products);
        }

        public List<dynamic> getDynamicProducts(List<BranchProduct> products)
        {
            var dynamicProducts = new List<dynamic>();
            var dynamicMains = new List<dynamic>();
            var dynamicSides = new List<dynamic>();
            var dynamicDesserts = new List<dynamic>();
            var dynamicPackages = new List<dynamic>();

            foreach (var product in products)
            {
                if (product.Product.ProductTypeId == 1)
                {
                    dynamic dynamicMain = new ExpandoObject();

                    dynamicMain.productID = product.ProductId;
                    dynamicMain.productName = product.Product.ProductName;
                    dynamicMain.productBarcode = product.Product.ProductBarcode;
                    dynamicMain.productPrice = product.ProductPrice.Where(zz => zz.ProductId == product.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                    dynamicMains.Add(dynamicMain);
                }
                else if (product.Product.ProductTypeId == 5)
                {
                    dynamic dynamicSide = new ExpandoObject();

                    dynamicSide.productID = product.ProductId;
                    dynamicSide.productName = product.Product.ProductName;
                    dynamicSide.productBarcode = product.Product.ProductBarcode;
                    dynamicSide.productPrice = product.ProductPrice.Where(zz => zz.ProductId == product.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                    dynamicSides.Add(dynamicSide);
                }
                else if (product.Product.ProductTypeId == 4)
                {
                    dynamic dynamicDessert = new ExpandoObject();

                    dynamicDessert.productID = product.ProductId;
                    dynamicDessert.productName = product.Product.ProductName;
                    dynamicDessert.productBarcode = product.Product.ProductBarcode;
                    dynamicDessert.productPrice = product.ProductPrice.Where(zz => zz.ProductId == product.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                    dynamicDesserts.Add(dynamicDessert);
                }
                else if (product.Product.ProductTypeId == 3)
                {
                    dynamic dynamicPackage = new ExpandoObject();

                    dynamicPackage.productID = product.ProductId;
                    dynamicPackage.productName = product.Product.ProductName;
                    dynamicPackage.productBarcode = product.Product.ProductBarcode;
                    dynamicPackage.productPrice = product.ProductPrice.Where(zz => zz.ProductId == product.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                    dynamicPackages.Add(dynamicPackage);
                }
            }

            dynamicProducts.Add(dynamicMains);
            dynamicProducts.Add(dynamicSides);
            dynamicProducts.Add(dynamicDesserts);
            dynamicProducts.Add(dynamicPackages);

            return dynamicProducts;
        }

        [HttpGet]
        [Route("GetVAT")]
        public dynamic GetVAT()
        {
            var vatPercentage = db.Vat.OrderByDescending(zz => zz.VatDate).Select(zz => zz.VatPercentage).FirstOrDefault();

            return vatPercentage;
        }

        [HttpPost]
        [Route("DoSale")]
        public dynamic Checkout([FromBody] SaleDataVM data)
        {
            try
            {
                using (var transact = db.Database.BeginTransaction())
                {
                    var saleID = db.Sale.OrderByDescending(zz => zz.SaleId).Select(zz => zz.SaleId).First() + 1;

                    var sale = new Sale { };

                    if (data.customerID == null)
                    {
                        sale = new Sale
                        {
                            SaleId = saleID,
                            DateOfSale = DateTime.Now,
                            SaleTotal = (int)data.saleTotal,
                            CustomerId = 1,
                            SaleStatusId = 3,
                            SaleTypeId = 1,
                            CompletionMethodId = 3,
                            BranchId = data.branchID,
                            EmployeeId = data.employeeID
                        };
                    }
                    else
                    {
                        sale = new Sale
                        {
                            SaleId = saleID,
                            DateOfSale = DateTime.Now,
                            SaleTotal = (int)data.saleTotal,
                            CustomerId = (int)data.customerID,
                            SaleStatusId = 3,
                            SaleTypeId = 1,
                            CompletionMethodId = 3,
                            BranchId = data.branchID,
                            EmployeeId = data.employeeID
                        };
                    }

                    db.Sale.Add(sale);
                    db.SaveChanges();

                    List<SaleLine> dynamicSaleLines = new List<SaleLine>();

                    foreach (var item in data.saleLines)
                    {
                        SaleLine dynamicSaleLine = new SaleLine();
                        dynamicSaleLine.BranchId = data.branchID;
                        dynamicSaleLine.ProductId = item.productID;
                        dynamicSaleLine.SaleId = saleID;
                        dynamicSaleLine.Quantity = item.quantity;

                        dynamicSaleLines.Add(dynamicSaleLine);
                    }

                    db.SaleLine.AddRange(dynamicSaleLines);
                    db.SaveChanges();

                    var Payment = new SalePaymentType
                    {
                        PaymentTypeId = db.PaymentType.Where(zz => zz.PaymentTypeDescription == data.paymentType).Select(zz => zz.PaymentTypeId).First(),
                        SaleId = saleID,
                        AmountPaid = data.saleTotal
                    };

                    db.SalePaymentType.Add(Payment);
                    db.SaveChanges();

                    transact.Commit();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        [HttpPost]
        [Route("EmailReceipt")]
        public ActionResult emailReceipt(SaleDataVM data)
        {
            string orderItems = "";
            foreach (var item in data.saleLines)
            {
                orderItems += item.quantity + "x " + item.productName + " " + "<span style='color:#92dbdb'>" + item.productPrice.ToString("C", CultureInfo.CreateSpecificCulture("af-ZA")) + "</span>" + " each" + "<br/>";
            }

            string employee = db.Employee.Where(zz => zz.EmployeeId == data.employeeID).Select(zz => string.Format("{0} {1}", zz.EmployeeName, zz.EmployeeSurname)).First();
            string branchName = db.Branch.Where(zz => zz.BranchId == data.branchID).Select(zz => zz.BranchName).First();
            string date = DateTime.Now.ToString();
            string formatDate = string.Format("{0:f}", date);
            string subject = "Receipt for purchase at The Food Works " + formatDate;

            string body = System.IO.File.ReadAllText("..\\The-Food-Works-WebAPI\\Assets\\receipt-template.html");
            body = body.Replace("**orderItems**", orderItems).Replace("**vatTotal**", string.Format("{0:R#,##0.00;(R#,##0.00);Zero}", data.vatTotal))
                .Replace("**grandTotal**", string.Format("{0:R#,##0.00;(R#,##0.00);Zero}", data.saleTotal)).Replace("**date**", formatDate)
                .Replace("**employee**", employee).Replace("**paymentMethod**", data.paymentType).Replace("**branchName**", branchName);

            new EmailSender().SendEmailAsync(data.emailAddress, subject, body);

            return Ok();
        }
    }
}