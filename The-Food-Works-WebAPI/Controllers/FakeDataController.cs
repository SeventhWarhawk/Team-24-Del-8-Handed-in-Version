using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FakeDataController : Controller
    {
        private readonly TheFoodWorksContext _dbContext;

        public FakeDataController(TheFoodWorksContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IActionResult Index()
        {
            return Ok("Choose an action");
        }
        //https://localhost:44325/FakeData/Customer?count=20
        [Route("Customer")]
        public IActionResult Customer(int count)
        {
            for (int i = 0; i < count; i++)
            {
                Customer newCustomer = new Customer();
                newCustomer.CustomerName = Faker.Name.First();
                newCustomer.CustomerSurname = Faker.Name.Last();
                newCustomer.CustomerTelephone = Faker.Phone.Number();
                newCustomer.CustomerTelephone = newCustomer.CustomerTelephone.Substring(newCustomer.CustomerTelephone.Length - 10);
                newCustomer.CustomerEmail = string.Format("{0}.{1}@test.com", newCustomer.CustomerName, newCustomer.CustomerSurname);
                _dbContext.Customer.Add(newCustomer);
                _dbContext.SaveChanges();
            }
            return Ok();
        }


        [Route("RandomBranchProduct")]
        public IActionResult RandomBranchProduct()
        {
            //_dbContext.Database.ExecuteSqlRaw("delete from product_price");

            var allProducts = _dbContext.Product.ToList();
            var allBranches = _dbContext.Branch.ToList();
            int maxProductPriceId = 0;
            foreach (Branch b in allBranches)
            {
                foreach (Product p in allProducts)
                {
                    //check if exists in branch already
                    var existingBP = _dbContext.BranchProduct.Where(bp => bp.ProductId == p.ProductId && bp.BranchId == b.BranchId).FirstOrDefault();
                    if (existingBP == null)
                    {
                        BranchProduct bp = new BranchProduct() { BranchId = b.BranchId, ProductId = p.ProductId };
                        bp.QuantityOnHand = new Random().Next(50);
                        if (p.ProductTypeId != 2)//no price for ingredients
                        {
                            ProductPrice newPrice = new ProductPrice() { BranchId = b.BranchId, ProductId = p.ProductId, ProductPriceDate = DateTime.Now };
                            newPrice.ProductPriceAmount = new Random().Next(50);
                            if (maxProductPriceId == 0)
                                maxProductPriceId = _dbContext.ProductPrice.Max(o => o.ProductPriceId) + 1;
                            else
                                maxProductPriceId++;
                            newPrice.ProductPriceId = maxProductPriceId;
                            _dbContext.ProductPrice.Add(newPrice);
                        }
                        _dbContext.BranchProduct.Add(bp);
                    }
                }
            }
            _dbContext.SaveChanges();


            return Ok();
        }
        //https://localhost:44325/FakeData/RandomSales?count=10
        //[Route("RandomSales")]
        //public IActionResult RandomSales(int count)
        //{
        //    Sale temp;
        //    int errorCount = 0;
        //    int recordsCreated = 0;
        //    DateTime startDate = new DateTime(2015, 1, 1);
        //    DateTime endDate = DateTime.Now;

        //    int maxSaleId = 0;
        //    int maxSalePaymentId = 0;

        //    var allProducts = _dbContext.Product.Where(p => p.ProductTypeId != 2).ToList(); //exclude ingredients
        //    var allBranches = _dbContext.Branch.ToList();
        //    var allCustomers = _dbContext.Customer.ToList();
        //    var allEmployees = _dbContext.Employee.ToList();

        //    for (int i = 0; i < count; i++)
        //    {
        //        if (maxSaleId == 0)
        //            maxSaleId = _dbContext.Sale.Max(o => o.SaleId) + 1;
        //        else
        //            maxSaleId++;
        //        if (maxSalePaymentId == 0)
        //            maxSalePaymentId = _dbContext.SalePaymentType.Max(o => o.PaymentTypeId) + 1;
        //        else
        //            maxSalePaymentId++;
        //        //generate a random date
        //        var randomTest = new Random();
        //        TimeSpan timeSpan = endDate - startDate;
        //        TimeSpan newSpan = new TimeSpan(0, randomTest.Next(0, (int)timeSpan.TotalMinutes), 0);
        //        DateTime newDate = startDate + newSpan;

        //        //initialize sale
        //        Sale newSale = new Sale();
        //        temp = newSale;
        //        newSale.SaleId = maxSaleId;
        //        newSale.CustomerId = allCustomers[new Random().Next(allCustomers.Count())].CustomerId;
        //        newSale.BranchId = allBranches[new Random().Next(allBranches.Count())].BranchId;
        //        newSale.EmployeeId = allEmployees[new Random().Next(allEmployees.Count())].EmployeeId;
        //        newSale.DateOfSale = newDate;
        //        newSale.SaleTotal = 0;
        //        newSale.SaleStatusId = 3;//they are all completed
        //        newSale.SaleTypeId = 1;//instore sales only for the moment
        //        newSale.CompletionMethodId = 2;//instore collection only, the scooter is broken
        //        int rSaleLines = new Random().Next(9) + 1;
        //        for (int j = 0; j < rSaleLines; j++)
        //        {
        //            SaleLine newSaleLine = new SaleLine();
        //            int rIdx = new Random().Next(allProducts.Count());
        //            newSaleLine.ProductId = allProducts[rIdx].ProductId;
        //            newSaleLine.BranchId = (int)newSale.BranchId;
        //            newSaleLine.Quantity = new Random().Next(8) + 1;

        //            double itemPrice = 0;
        //            BranchProduct bp = _dbContext.BranchProduct.Include(p => p.ProductPrice).Where(o => o.BranchId == newSaleLine.BranchId && o.ProductId == newSaleLine.ProductId).FirstOrDefault();
        //            if (bp != null)
        //            {
        //                if (bp.ProductPrice.Count > 0)
        //                {
        //                    itemPrice = bp.ProductPrice.FirstOrDefault().ProductPriceAmount;
        //                }
        //                else//no price for this branch
        //                {
        //                    itemPrice = new Random().Next(150) + 1;
        //                }
        //                newSale.SaleTotal += (int)(itemPrice * newSaleLine.Quantity);
        //                //check we are not adding the same product twice
        //                if (newSale.SaleLine.Where(c => c.ProductId == newSaleLine.ProductId).Count() == 0)
        //                    newSale.SaleLine.Add(newSaleLine);
        //            }
        //            else
        //            {
        //                //could not find a price, don't add this saleLine
        //            }
        //        }
        //        SalePaymentType newSalePayment = new SalePaymentType();
        //        newSalePayment.AmountPaid = newSale.SaleTotal;
        //        newSalePayment.PaymentTypeId = new Random().Next(3) + 1;//ignoring "Not Paid" type
        //        //newSalePayment. = maxSalePaymentId;
        //        newSale.SalePaymentType.Add(newSalePayment);
        //        try
        //        {
        //            _dbContext.Sale.Add(newSale);
        //            _dbContext.SaveChanges();
        //            recordsCreated++;
        //        }
        //        catch (Exception e)
        //        {
        //            errorCount++;
        //        }

        //    }
        //    String message = String.Format("Created:{0}\n errors{1}", recordsCreated, errorCount);
        //    return Ok(message);
        //}



    }
}