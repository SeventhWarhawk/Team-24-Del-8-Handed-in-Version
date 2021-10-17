using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Helpers;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;
using System.Text.Json;
using System.Text.Json.Serialization;
using static The_Food_Works_WebAPI.ViewModels.Data;
using static The_Food_Works_WebAPI.ViewModels.GlobalVariables;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ManufacturingController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        private UserInfoVM currentUser = MyGlobalVariable;

        [HttpGet]
        [Route("GetAllCookingLists")]
        public List<dynamic> getAllCookingLists()
        {
            var cookingLists = db.CookingList.Where(x => x.CookingListDate >= DateTime.Now.Date).OrderBy(x => x.CookingListDate).ToList();
            return getDynamicCookingLists(cookingLists);
        }

        public List<dynamic> getDynamicCookingLists(List<CookingList> cookingLists)
        {
            var dynamicLists = new List<dynamic>();

            foreach (var list in cookingLists)
            {
                dynamic dynamicCookingList = new ExpandoObject();

                dynamicCookingList.CookingListId = list.CookingListId;
                dynamicCookingList.CookingListDate = list.CookingListDate;

                dynamicLists.Add(dynamicCookingList);
            }

            return dynamicLists;
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("AddCookingList")]
        public ActionResult addCookingList(CookingList cookingList)
        {
            CookingList cookingListToWrite, cookingListToDisplay;
            try
            {
                var dates = db.CookingList.Select(x => x.CookingListDate.Date).ToList();
                if (dates.Contains(cookingList.CookingListDate.Date.AddDays(1)))
                {
                    return Forbid();
                }
                else
                {
                    int lastID = db.CookingList.Max(x => x.CookingListId);
                    cookingListToWrite = new CookingList
                    {
                        CookingListId = lastID + 1,
                        CookingListDate = cookingList.CookingListDate.AddDays(1),
                    };

                    cookingListToDisplay = new CookingList
                    {
                        CookingListId = lastID + 1,
                        CookingListDate = cookingList.CookingListDate,
                    };
                    db.CookingList.Add(cookingListToWrite);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok(cookingListToDisplay);
        }

        [HttpGet]
        [Route("GetProductsNeeded")]
        public ActionResult getProductsNeeded()
        {
            ProductionVM productNeeded = new ProductionVM { };
            ProductionVM productToAdd;

            List<ProductionVM> productNumbers = new List<ProductionVM>();
            try
            {
                var finishedProducts = db.BranchProduct.Include(x => x.Product).Where(x => x.Product.ProductTypeId != 2 && x.Product.ProductTypeId != 3 && x.BranchId == MyGlobalVariable.BranchId).ToList();

                //orderlins that are not yet complete
                var orderlines = db.SaleLine.Include(x => x.Sale).Where(x => x.Sale.SaleStatusId == 1 && x.Sale.SaleTypeId == 2).ToList();

                //request lines that are noy yet completed
                var requestLines = db.BranchRequestLine.Include(x => x.BranchRequest).Where(x => x.BranchRequest.RequestStatusId == 1).ToList();

                int quantityOrdered = 0;

                int quantityRequested = 0;

                //get details of finished products
                foreach (var fp in finishedProducts)
                {
                    quantityOrdered = getQuantityOrdered(orderlines, fp.ProductId);

                    quantityRequested = getQuantityRequested(requestLines, fp.ProductId);

                    productToAdd = new ProductionVM
                    {
                        ProductId = fp.Product.ProductId,
                        ProductBarcode = fp.Product.ProductBarcode,
                        ProductName = fp.Product.ProductName,
                        QuantityOnHand = (double)fp.QuantityOnHand,
                        QuantityOrdered = quantityOrdered,
                        QuantityRequested = quantityRequested,
                    };
                    productNumbers.Add(productToAdd);
                }

                return Ok(productNumbers.OrderBy(x => x.ProductName));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        public int getQuantityOrdered(List<SaleLine> ol, int productId)
        {
            int qo = 0;
            foreach (var sale1 in ol)
            {
                if (sale1.ProductId == productId)
                {
                    qo = qo + sale1.Quantity;
                }
            }

            return qo;
        }

        public int getQuantityRequested(List<BranchRequestLine> rls, int productId)
        {
            int ro = 0;
            foreach (var rl in rls)
            {
                if (rl.ProductId == productId)
                {
                    ro = ro + rl.RequestedQuantity;
                }
            }

            return ro;
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("WriteBatch")]
        public ActionResult writeBatch(ProductionVM batch)
        {
            try
            {
                //get batchID
                int lastID = db.Batch.Max(x => x.BatchId);

                Batch batchToWrite = new Batch
                {
                    BatchId = lastID + 1,
                    CookingListId = batch.CookingListId,
                    BatchStatusId = 1,
                };
                db.Batch.Add(batchToWrite);
                db.SaveChanges();

                foreach (var line in batch.batchLines)
                {
                    BatchLine batchLinesToWrite = new BatchLine
                    {
                        ProductId = line.ProductId,
                        BatchId = lastID + 1,
                        Quantity = line.Quantity,
                    };
                    db.BatchLine.Add(batchLinesToWrite);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }

        [HttpGet]
        [Route("GetBatches")]
        public List<dynamic> getBatches()
        {
            var batches = db.Batch.Include(x => x.CookingList).Include(x => x.BatchStatus).Where(x => x.BatchStatusId == 1).OrderBy(x => x.CookingList.CookingListDate).ToList();

            var dynamicBatches = new List<dynamic>();

            foreach (var batch in batches)
            {
                dynamic dynamicBatch = new ExpandoObject();
                dynamicBatch.BatchId = batch.BatchId;
                dynamicBatch.CookingListDate = batch.CookingList.CookingListDate;
                dynamicBatch.BatchStatusName = batch.BatchStatus.BatchStatusName;
                dynamicBatches.Add(dynamicBatch);
            }
            return (dynamicBatches);
        }

        [HttpPost]
        [Route("GetBatchDetails")]
        public ActionResult getBatchDetails(object batchid)
        {
            try
            {
                string jsonString = System.Text.Json.JsonSerializer.Serialize(batchid);
                int batchID = Convert.ToInt32(jsonString);

                var batchDetails = db.BatchLine.Include(x => x.Batch).ThenInclude(x => x.CookingList).Include(x => x.Product).Where(x => x.BatchId == batchID).ToList();

                var dynamicBatchDetails = new List<dynamic>();

                foreach (var bd in batchDetails)
                {
                    dynamic dynamicBatchDetail = new ExpandoObject();
                    dynamicBatchDetail.BatchId = bd.BatchId;
                    dynamicBatchDetail.CookingListId = bd.Batch.CookingList.CookingListId;
                    dynamicBatchDetail.CookingListDate = bd.Batch.CookingList.CookingListDate;
                    dynamicBatchDetail.ProductId = bd.ProductId;
                    dynamicBatchDetail.ProductName = bd.Product.ProductName;
                    dynamicBatchDetail.Quantity = bd.Quantity;

                    dynamicBatchDetails.Add(dynamicBatchDetail);

                }
                return Ok(dynamicBatchDetails);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }




        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("UpdateBatchDetails")]
        public ActionResult getBatchDetails(BatchLine updatedBatch)
        {
            //get batch line to update
            try
            {
                var toUpdate = db.BatchLine.Where(x => x.BatchId == updatedBatch.BatchId && x.ProductId == updatedBatch.ProductId).FirstOrDefault();

                toUpdate.Quantity = updatedBatch.Quantity;

                db.SaveChanges();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok();
        }

        [HttpGet]
        [Route("GetEmployees")]
        public List<dynamic> getEmployeeList()
        {
            var employees = db.User.Include(x => x.Employee).Where(x => x.UserStatusId == 1 && x.UserRoleId == 5).ToList();

            var dynamicEmployees = new List<dynamic>();

            foreach (var employee in employees)
            {
                dynamic dynamicEmployee = new ExpandoObject();
                dynamicEmployee.EmployeeId = employee.EmployeeId;
                dynamicEmployee.FullName = employee.Employee.EmployeeName;
                dynamicEmployee.Surname = employee.Employee.EmployeeSurname;
                dynamicEmployees.Add(dynamicEmployee);
            }

            return (dynamicEmployees);
        }

        [HttpGet]
        [Route("GetCookingListDetails")]
        public ActionResult getCookingListDetails()
        {
            var dynamicBatchDetails = new List<dynamic>();
            try
            {
                var todaysDate = DateTime.Now.Date;

                var cookingListDetails = db.CookingList.Where(x => x.CookingListDate == todaysDate).FirstOrDefault();

                var batches = db.Batch.Where(x => x.CookingList.CookingListId == cookingListDetails.CookingListId).ToList();

                if (cookingListDetails == null)
                {
                    return null;
                }

                foreach (var batch in batches)
                {
                    if (batch.BatchStatusId == 3)
                    {
                        var errorList = new List<dynamic>();
                        errorList.Add("already reconciled");

                        return Forbid();
                    }

                    var batchDetails = db.BatchLine.Include(x => x.Batch).Include(x => x.Product).Where(x => x.BatchId == batch.BatchId).ToList();

                    dynamic dynamicBatch = new ExpandoObject();

                    foreach (var bd in batchDetails)
                    {
                        dynamic dynamicBd = new ExpandoObject();
                        dynamicBd.CookingListId = cookingListDetails.CookingListId;
                        dynamicBd.CookingListDate = cookingListDetails.CookingListDate;
                        dynamicBd.ProductId = bd.ProductId;
                        dynamicBd.ProductName = bd.Product.ProductName;
                        dynamicBd.BatchId = bd.BatchId;
                        dynamicBd.Quantity = bd.Quantity;

                        dynamicBatchDetails.Add(dynamicBd);
                    }
                }
                return Ok(dynamicBatchDetails.OrderBy(x => x.BatchId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("ReconcileBatch")]
        public ActionResult reconcileBatch(ProductionVM batch)
        {
            try
            {
                var batchesToUpdate = db.Batch.Where(x => x.BatchId == batch.BatchId).FirstOrDefault();
                batchesToUpdate.BatchStatusId = 3;

                foreach (var batchLine in batch.batchLines)
                {
                    var branchProduct = db.BranchProduct.Where(x => x.BranchId == 1 && x.ProductId == batchLine.ProductId).FirstOrDefault();
                    var productContents = db.ProductContent.Where(x => x.ProductId == branchProduct.ProductId).ToList();
                    var currentBatchLine = db.BatchLine.Where(x => x.ProductId == batchLine.ProductId && x.BatchId == batchLine.BatchId).FirstOrDefault();

                    currentBatchLine.EmployeeId = batchLine.EmployeeId;
                    currentBatchLine.Quantity = batchLine.Quantity;

                    branchProduct.QuantityOnHand = branchProduct.QuantityOnHand + batchLine.Quantity;
                    if (productContents != null)
                    {
                        foreach (var content in productContents)
                        {
                            var contentProduct = db.BranchProduct.Where(x => x.BranchId == MyGlobalVariable.BranchId && x.ProductId == content.ProductContentId).FirstOrDefault();
                            var currentQOH = contentProduct.QuantityOnHand;
                            contentProduct.QuantityOnHand = currentQOH - (content.Quantity * batchLine.Quantity);
                            db.SaveChanges();
                        }
                    }

                    //         foreach(var batchLine in batch.batchLines)
                    //         {
                    //             var branchProduct = db.BranchProduct.Where(x => x.BranchId == MyGlobalVariable.BranchId && x.ProductId == batchLine.ProductId).FirstOrDefault();
                    //             var productContents = db.ProductContent.Where(x => x.ProductId == branchProduct.ProductId).ToList();

                    db.SaveChanges();

                    //       db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("DeleteBatch")]
        public ActionResult deleteBatch(BatchVm toDelete)
        {
            try
            {
                var batchToDelete = db.Batch.Include(x => x.CookingList).Where(x => x.BatchId == toDelete.BatchId).FirstOrDefault();
                var batchlines = db.BatchLine.Where(x => x.BatchId == batchToDelete.BatchId).ToList();
                if (batchlines != null)
                {
                    if (batchToDelete.BatchStatusId == 1 && batchToDelete.CookingList.CookingListDate.Date < DateTime.Now.Date)
                    {
                        foreach (var line in batchlines)
                        {
                            db.BatchLine.Remove(line);
                        }
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                db.Batch.Remove(batchToDelete);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("GetSpecificCookingListDetails")]
        public ActionResult getSpecificCookingListDetails(BatchVm toView)
        {
            try
            {
                var fullCookingList = db.CookingList.Include(x => x.Batch).ThenInclude(x => x.BatchLine).Where(x => x.CookingListDate == toView.CookingListDate).FirstOrDefault();

                CookingListVm cookingList = new CookingListVm() { };

                List<BatchLineVm> tempLines = new List<BatchLineVm>();
                List<Batch> tempBatchs = new List<Batch>();

                foreach (var batch in fullCookingList.Batch)
                {
                    tempBatchs.Add(batch);
                    foreach (var line in batch.BatchLine)
                    {
                        string productName = db.Product.Where(x => x.ProductId == line.ProductId).Select(x => x.ProductName).FirstOrDefault();
                        BatchLineVm templine = new BatchLineVm
                        {
                            ProductId = line.ProductId,
                            Quantity = line.Quantity,
                            BatchId = line.BatchId,
                            ProductName = productName,
                        };
                        tempLines.Add(templine);
                    }
                }
                cookingList.CookingListId = fullCookingList.CookingListId;
                cookingList.CookingListDate = fullCookingList.CookingListDate;
                cookingList.batches = tempBatchs;
                cookingList.batchLines = tempLines;

                return Ok(cookingList);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpPost]
        [Route("DeleteCookingList")]
        public ActionResult deleteCookingList(BatchVm toDelete)
        {
            try
            {
                var cookingListWithBatches = db.CookingList.Include(x => x.Batch).Where(x => x.CookingListDate.Date == toDelete.CookingListDate).FirstOrDefault();

                var cookingListToDelete = db.CookingList.Where(x => x.CookingListDate == toDelete.CookingListDate).FirstOrDefault();
                db.CookingList.Remove(cookingListToDelete);
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