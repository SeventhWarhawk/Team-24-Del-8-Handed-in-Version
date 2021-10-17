using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;
using static The_Food_Works_WebAPI.ViewModels.Data;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //----------------------STOCK REPORT---------------------------
        [HttpPost]
        [Route("ReportBranchProductStock")]
        public string ReportBranchProductStock(ReportVM vm)
        {
            int branchId = vm.BranchId;
            if (branchId != -1)
            {
                DataTable dt = ExecSP("ReportBranchProductStock",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
            else
            {
                DataTable dt = ExecSP("ReportBranchProductStockALL",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
        }


        [HttpPost]
        [Route("ReportBranchProductIngredients")]
        public string ReportBranchProductIngredients(ReportVM vm)
        {
            int branchId = vm.BranchId;
            if (branchId != -1)
            {
                DataTable dt = ExecSP("ReportBranchProductIngredients",
                    new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                    });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
            else
            {
                DataTable dt = ExecSP("ReportBranchProductIngredientsALL",
                   new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                   });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
        }

        //----------------GENERATE SALES REPORT --------------------
        [HttpPost]
        [Route("ReportDailySales")]
        public string ReportDailySales(ReportVM sm)
        {
            int branchId = sm.BranchId;
            int year = sm.endDate.Year;
            if (branchId != -1)
            {
                DataTable dt = ExecSP("ReportDailySales",
                    new SqlParameter[] {
                    new SqlParameter("@branchId", branchId),
                    new SqlParameter("@year", year)
                    });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
            else
            {
                DataTable dt = ExecSP("ReportDailySalesALL",
                    new SqlParameter[] {
                    new SqlParameter("@branchId", branchId),
                    new SqlParameter("@year", year)
                    });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
        }

        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("ReportAccumulatedSales")]
        public string ReportAccumulatedSales(ReportVM vm)
        {
            int branchId = vm.BranchId;
            if (branchId != -1)
            {
                DataTable dt = ExecSP("ReportAccumulatedSales",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
            else
            {
                DataTable dt = ExecSP("ReportAccumulatedSalesALL",
                    new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
        }

        //--------------------------
        [HttpPost]
        [Route("ReportProductTrends")]
        public string ReportProductTrends(ProductReportVM vm)
        {
            int branchId = vm.BranchId;
            DateTime fromDate = vm.startDate.Date;
            DateTime toDate = vm.endDate.Date;

            if (branchId != -1)
            {
                DataTable dt = ExecSP("ReportProductTrends",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId),
                    new SqlParameter("@fromDate", fromDate),
                    new SqlParameter("@toDate", toDate)
                });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
            else
            {
                DataTable dt = ExecSP("ReportProductTrendsALL",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId),
                    new SqlParameter("@fromDate", fromDate),
                    new SqlParameter("@toDate", toDate)
                });
                string JSONString = DataTableToJson(dt);
                return JSONString;
            }
        }

        [HttpPost]
        [Route("BranchRequests")]
        public IActionResult BranchRequests(ProductReportVM vm)
        {
            try
            { 
                int branchId = vm.BranchId;
                DateTime fromDate = vm.startDate.Date;
                DateTime toDate = vm.endDate.Date;
                var brancheRequestsData = new List<dynamic>();

                var brancheRequests = db.BranchRequest

                    .Where(o => (o.BranchId == branchId) && (o.BranchRequestDate >= fromDate) && (o.BranchRequestDate <= toDate))
                    .Select(br => new { br.BranchRequestId, br.BranchRequestDate, br.RequestStatus })
                    .ToList()
                    ;
                foreach (var br in brancheRequests)
                {
                    dynamic dynamicBranchRequest = new ExpandoObject();
                    dynamicBranchRequest.RequestId = br.BranchRequestId;
                    dynamicBranchRequest.Date = br.BranchRequestDate;
                    dynamicBranchRequest.Status = br.RequestStatus;

                    List<BranchRequestLine> requestLines = db.BranchRequestLine
                        .Where(brl => brl.BranchRequestId == br.BranchRequestId)
                        .Include(p => p.Product)
                        .ToList();

                    dynamicBranchRequest.RequestLines = new List<dynamic>();
                    foreach (BranchRequestLine brl in requestLines)
                    {
                        dynamic dynamicRequestLine = new ExpandoObject();
                        dynamicRequestLine.ProductId = brl.ProductId;
                        dynamicRequestLine.ProductName = brl.Product.ProductName;
                        dynamicRequestLine.Quantity = brl.RequestedQuantity;
                        dynamicBranchRequest.RequestLines.Add(dynamicRequestLine);
                    }
                    brancheRequestsData.Add(dynamicBranchRequest);
                }

                return Ok(brancheRequestsData);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private DataTable ExecSP(string procName, SqlParameter[] parameters)
        {
            SqlConnection con = (SqlConnection)db.Database.GetDbConnection();
            SqlCommand com = new SqlCommand(procName, con);
            com.CommandType = CommandType.StoredProcedure;
            foreach (SqlParameter p in parameters)
            {
                com.Parameters.Add(p);
            }
            SqlDataAdapter da = new SqlDataAdapter(com);
            DataTable dt = new DataTable();

            con.Open();
            da.Fill(dt);
            con.Close();
            return dt;
        }

        private static string DataTableToJson(DataTable dt)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                rows.Add(row);
            }
            return JsonConvert.SerializeObject(rows);
        }

        // Get Product Categories
        [HttpGet]
        [Route("GetBranches")]
        public List<dynamic> getBranches()
        {
            using var db = new TheFoodWorksContext();
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
        [HttpPost]
        [Route("GetAllSales")]
        public List<TodaySalesVM> getAllSales(BranchSelectionVM vm)
        {
            var branchID = vm.branchId;
            if (branchID != -1)
            {
                var dbSales = db.Sale.Where(X => X.BranchId == branchID && X.DateOfSale == DateTime.Today).ToList();
                List<TodaySalesVM> output = new List<TodaySalesVM>();
                for (int i = 0; i < dbSales.Count; i++)
                {
                    var PID = db.SalePaymentType.Where(x => x.SaleId == dbSales[i].SaleId).Select(x => x.PaymentTypeId).FirstOrDefault();
                    TodaySalesVM addMe = new TodaySalesVM()
                    {
                        paymentType = db.PaymentType.Where(x => x.PaymentTypeId == PID).Select(x => x.PaymentTypeDescription).FirstOrDefault(),
                        SaleTotal = dbSales[i].SaleTotal,
                        completionMethod = db.CompletionMethod.Where(x => x.CompletionMethodId == dbSales[i].CompletionMethodId).Select(y => y.CompletionMethodDescription).FirstOrDefault(),
                        saleType = db.SaleType.Where(x => x.SaleTypeId == dbSales[i].SaleTypeId).Select(x => x.SaleTypeDescription).FirstOrDefault(),
                    //    if (dbSales[i].CustomerId != null)
                    //{
                        customerName = db.Customer.Where(x => x.CustomerId == dbSales[i].CustomerId).Select(x => x.CustomerName).FirstOrDefault(),
                            //}
                        employeeName = db.Employee.Where(x => x.EmployeeId == dbSales[i].EmployeeId).Select(x => x.EmployeeName).FirstOrDefault(),
                    };
                    output.Add(addMe);
                }
                return output;
            }
            else
            {
                var dbSales = db.Sale.Where(X => X.DateOfSale == DateTime.Today).ToList();
                List<TodaySalesVM> output = new List<TodaySalesVM>();
                for (int i = 0; i < dbSales.Count(); i++)
                {
                    var PID = db.SalePaymentType.Where(x => x.SaleId == dbSales[i].SaleId).Select(x => x.PaymentTypeId).FirstOrDefault();

                    TodaySalesVM addMe = new TodaySalesVM()
                    {
                        paymentType = db.PaymentType.Where(x => x.PaymentTypeId == PID).Select(x => x.PaymentTypeDescription).FirstOrDefault(),
                        SaleTotal = dbSales[i].SaleTotal,
                        completionMethod = db.CompletionMethod.Where(x => x.CompletionMethodId == dbSales[i].CompletionMethodId).Select(y => y.CompletionMethodDescription).FirstOrDefault(),
                        saleType = db.SaleType.Where(x => x.SaleTypeId == dbSales[i].SaleTypeId).Select(x => x.SaleTypeDescription).FirstOrDefault(),
                        customerName = db.Customer.Where(x => x.CustomerId == dbSales[i].CustomerId).Select(x => x.CustomerName).FirstOrDefault(),
                        employeeName = db.Employee.Where(x => x.EmployeeId == dbSales[i].EmployeeId).Select(x => x.EmployeeName).FirstOrDefault(),
                    };
                    output.Add(addMe);
                }
                return output;
            }
        }

        [HttpGet]
        [Route("GetSales/{branchID}")]
        public dynamic getSales([FromRoute] int branchID)
        {
            DateTime startDayOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + (int)DayOfWeek.Monday);
            DateTime endDayOfWeek = startDayOfWeek.AddDays(6);

            var sales = db.Sale.Where(zz => zz.BranchId == branchID && zz.DateOfSale >= startDayOfWeek && zz.DateOfSale <= endDayOfWeek)
                .GroupBy(zz => zz.DateOfSale).Select(zz => new DashboardSaleVM() { date = zz.Key, total = zz.Sum(zz => zz.SaleTotal) }).ToList();

            var dynamicSales = new List<dynamic>();
            var dynamicCurrentDates = new List<dynamic>();
            var dynamicPreviousDates = new List<dynamic>();

            for (DateTime counter = startDayOfWeek; counter <= endDayOfWeek; counter = counter.AddDays(1))
            {
                var check = sales.Where(zz => zz.date == counter).FirstOrDefault();
                if (check != null)
                {
                    dynamicCurrentDates.Add(check.total);
                }
                else
                {
                    dynamicCurrentDates.Add(0);
                }
            }

            startDayOfWeek = startDayOfWeek.AddDays(-7);
            endDayOfWeek = endDayOfWeek.AddDays(-7);

            sales = db.Sale.Where(zz => zz.BranchId == branchID && zz.DateOfSale >= startDayOfWeek && zz.DateOfSale <= endDayOfWeek)
                .GroupBy(zz => zz.DateOfSale).Select(zz => new DashboardSaleVM() { date = zz.Key, total = zz.Sum(zz => zz.SaleTotal) }).ToList();

            for (DateTime counter = startDayOfWeek; counter <= endDayOfWeek; counter = counter.AddDays(1))
            {
                var check = sales.Where(zz => zz.date == counter).FirstOrDefault();
                if (check != null)
                {
                    dynamicPreviousDates.Add(check.total);
                }
                else
                {
                    dynamicPreviousDates.Add(0);
                }
            }

            dynamicSales.Add(dynamicCurrentDates);
            dynamicSales.Add(dynamicPreviousDates);

            return dynamicSales;
        }

        // CATEGORY SALES
        [HttpPost]
        [Route("GetCategorySales")]
        public CategorySalesVM GetCategorySales(BranchSelectionVM vm)
        {
            var branchID = vm.branchId;
            if (branchID != -1)
            {
                var dbSales = db.SaleLine.Where(X => X.BranchId == branchID && X.Sale.DateOfSale == DateTime.Today).ToList();
                
                CategorySalesVM addMe = new CategorySalesVM();
                for (int i = 0; i < dbSales.Count; i++)
                {
                    var P = db.Product.Where(x => x.ProductId == dbSales[i].ProductId).Select(x => x.ProductType.ProductTypeId).FirstOrDefault();
                    if(P == 1)
                    {
                        addMe.mainCount += 1;
                    }
                    if(P == 4)
                    {
                        addMe.sideCount += 1; 
                    }
                    if (P == 5)
                    {
                        addMe.dessertCount += 1;
                    }
                    if (P == 3)
                    {
                        addMe.packageCount += 1;
                    }

                }
                return addMe;
            }
            else
            {
                var dbSales = db.SaleLine.Where(X => X.Sale.DateOfSale == DateTime.Today).ToList();
                CategorySalesVM addMe = new CategorySalesVM();
                for (int i = 0; i < dbSales.Count; i++)
                {
                    var P = db.Product.Where(x => x.ProductId == dbSales[i].ProductId).Select(x => x.ProductType.ProductTypeId).FirstOrDefault();
                    if (P == 1)
                    {
                        addMe.mainCount += 1;
                    }
                    if (P == 4)
                    {
                        addMe.sideCount += 1;
                    }
                    if (P == 5)
                    {
                        addMe.dessertCount += 1;
                    }
                    if (P == 3)
                    {
                        addMe.packageCount += 1;
                    }

                }
                return addMe;
            }
        }

        [HttpGet]
        [Route("GetPopularProducts/{branchID}")]
        public dynamic getPopularProducts([FromRoute] int branchID)
        {
            DateTime startDayOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + (int)DayOfWeek.Monday);
            DateTime endDayOfWeek = startDayOfWeek.AddDays(6);

            var products = db.SaleLine.Include(zz => zz.Sale).Include(zz => zz.BranchProduct).ThenInclude(zz => zz.Product).Where(zz => zz.BranchId == branchID && zz.Sale.DateOfSale >= startDayOfWeek && zz.Sale.DateOfSale <= endDayOfWeek)
                .GroupBy(zz => zz.BranchProduct.Product.ProductName).Select(zz => new DashboardPopularVM() { productName = zz.Key, quantiy = zz.Sum(zz => zz.Quantity) }).
                OrderByDescending(zz => zz.quantiy).Take(3).ToList();

            var dynamicProducts = new List<dynamic>();
            var dynamicNames = new List<dynamic>();
            var dynamicQuantities = new List<dynamic>();

            foreach (var product in products)
            {
                dynamicNames.Add(product.productName);
                dynamicQuantities.Add(product.quantiy);
            }

            dynamicProducts.Add(dynamicNames);
            dynamicProducts.Add(dynamicQuantities);

            return dynamicProducts;
        }

        //write off products
        [HttpPost]
        [Route("WriteOffHistory")]
        public List<WriteOffHistoryVM> WriteOffHistory(ProductReportVM vm)
        {
            int branchId = vm.BranchId;
            DateTime fromDate = vm.startDate.Date;
            DateTime toDate = vm.endDate.Date;
            var productData = new List<WriteOffHistoryVM>();
            var temp = db.WriteOffProduct.ToList();
            if(branchId != -1)
            {
                temp = db.WriteOffProduct.Where(x => (x.WriteOffDate >= fromDate) && (x.WriteOffDate <= toDate) && x.BranchId == branchId).ToList();

            }
            else
            {
                temp = db.WriteOffProduct.Where(x => (x.WriteOffDate >= fromDate) && (x.WriteOffDate <= toDate)).ToList();

            }
            foreach(var i in temp)
            {
                WriteOffHistoryVM obj = new WriteOffHistoryVM()
                {
                    productName = db.Product.Where(x => x.ProductId == i.ProductId).Select(x => x.ProductName).FirstOrDefault(),
                    WOReason = i.WriteOffReason,
                    WOQuantity = i.WriteOffQuantity,
                    date = i.WriteOffDate
                };
                productData.Add(obj);
            }
            return productData;
        }
        
            // ingredients ordered most during period
            [HttpPost]
        [Route("FrequencyInsight")]
        public List<OrderedHitsVM> FrequencyInsight(ProductReportVM vm)
        {
            var productData = new List<OrderedHitsVM>();
            try
            {
                int branchId = vm.BranchId;
                DateTime fromDate = vm.startDate.Date;
                DateTime toDate = vm.endDate.Date;
              

                var orders = db.SupplierOrder
                    .Where(o => (o.SupplierOrderDate >= fromDate) && (o.SupplierOrderDate <= toDate))
                    .ToList();
                var Popular = 0;
                foreach (var i in orders)
                {
                    var uniqueProduct = db.SupplierOrderLine.Where(x => x.SupplierOrderId == i.SupplierOrderId).Select(y => y.ProductId).FirstOrDefault();
                    var count = db.SupplierOrderLine.Where(x => x.ProductId == uniqueProduct).Count();
                    var total = count * db.SupplierOrderLine.Where(x => x.ProductId == uniqueProduct).Select(x => x.SupplierOrderLineQuantity).FirstOrDefault();
                    if(Popular < count)
                    {
                        Popular = count;
                    }

                    OrderedHitsVM obj = new OrderedHitsVM()
                    { productName = db.Product.Where( x => x.ProductId == uniqueProduct).Select( x=> x.ProductName).FirstOrDefault(),
                      totalOrdered = total,
                      orderFrequency = count
                    };

                    if(productData != null)
                    {
                        if (productData.Count == 0)
                        {
                            productData.Add(obj);
                        }
                        foreach (var x in productData)
                        {
                            if(x.productName != obj.productName)
                            {
                                productData.Add(obj);
                            }
                        }
                    }
                    
                  

                }
                return productData;
            }
            catch (Exception e)
            {
                return productData;
            }
        }

    }
}