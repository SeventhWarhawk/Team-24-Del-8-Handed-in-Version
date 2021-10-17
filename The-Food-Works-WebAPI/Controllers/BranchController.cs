using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;
using static The_Food_Works_WebAPI.ViewModels.Data;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BranchController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        // Create New Branch ------------------------------------------------------------------------------------------------------------------------------->
        [HttpPost]
        [Route("CreateBranch")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult CreateBranch([FromBody] BranchesVM newBranch)
        {
            List<Branch> bs = new List<Branch>();
            bs = db.Branch.ToList();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                for (int i = 0; i < bs.Count; i++)
                {
                    if (newBranch.branch.BranchName == bs[i].BranchName)
                    {
                        return BadRequest("A branch with this name already exists!");
                    }
                }

                using (var transSQL = db.Database.BeginTransaction())
                {
                    var branch = new Branch
                    {
                        BranchName = newBranch.branch.BranchName,
                        BranchContactNumber = newBranch.branch.BranchContactNumber,
                        BranchEmailAddress = newBranch.branch.BranchEmailAddress,
                        BranchImage = newBranch.branch.BranchImage,
                        BranchStatus = true
                    };

                    db.Branch.Add(branch);
                    db.SaveChanges();

                    var branchAddress = new BranchAddress
                    {
                        BranchAddressFull = newBranch.address.BranchAddressFull,
                        BranchStreetName = newBranch.address.BranchStreetName,
                        BranchSuburb = newBranch.address.BranchSuburb,
                        BranchCity = newBranch.address.BranchCity,
                        BranchProvince = newBranch.address.BranchProvince,
                        BranchCountry = newBranch.address.BranchCountry,
                        BranchZip = newBranch.address.BranchZip,
                        BranchDate = DateTime.Now,
                        BranchLate = newBranch.address.BranchLate,
                        BranchLng = newBranch.address.BranchLng,
                        BranchId = branch.BranchId
                    };

                    db.BranchAddress.Add(branchAddress);
                    db.SaveChanges();

                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Update Branch-------------------------------------------------------------------------------------------------------------------------------------->
        [HttpPost]
        [Route("UpdateBranch/{BranchId}")]
        public ActionResult UpdateBranch([FromBody] BranchUpdateVM updatedBranch, [FromRoute] int branchId)
        {
            List<Branch> bs = new List<Branch>();
            bs = db.Branch.ToList();
            var existingBranchId = db.Branch.Where(x => x.BranchName == updatedBranch.BranchName).Select(x => x.BranchId).FirstOrDefault();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                for (int i = 0; i < bs.Count; i++)
                {
                    if (updatedBranch.BranchName == bs[i].BranchName && existingBranchId != branchId)
                    {
                        return BadRequest("A branch with this name already exists!");
                    }
                }

                using (var transSQL = db.Database.BeginTransaction())
                {
                    var branchToUpdate = db.Branch.Where(x => x.BranchId == branchId).FirstOrDefault();
                    branchToUpdate.BranchName = updatedBranch.BranchName;
                    branchToUpdate.BranchContactNumber = updatedBranch.BranchContactNumber;
                    branchToUpdate.BranchEmailAddress = updatedBranch.BranchEmailAddress;
                    branchToUpdate.BranchImage = updatedBranch.BranchImage;
                    branchToUpdate.BranchStatus = updatedBranch.BranchStatus;
                    var branchAddressToUpdate = db.BranchAddress.Where(x => x.BranchId == branchId).FirstOrDefault();
                    branchAddressToUpdate.BranchAddressFull = updatedBranch.BranchAddressFull;
                    branchAddressToUpdate.BranchStreetName = updatedBranch.BranchStreetName;
                    branchAddressToUpdate.BranchSuburb = updatedBranch.BranchSuburb;
                    branchAddressToUpdate.BranchCity = updatedBranch.BranchCity;
                    branchAddressToUpdate.BranchProvince = updatedBranch.BranchProvince;
                    branchAddressToUpdate.BranchCountry = updatedBranch.BranchCountry;
                    branchAddressToUpdate.BranchZip = updatedBranch.BranchZip;
                    branchAddressToUpdate.BranchLate = updatedBranch.BranchLate;
                    branchAddressToUpdate.BranchLng = updatedBranch.BranchLng;

                    db.SaveChanges();
                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Get All Branches ---------------------------------------------------------------------------------------------------------------------------------->
        [HttpGet]
        [Route("GetBranchData")]
        public List<dynamic> GetBranches()
        {
            var branches = db.Branch.Include(x => x.BranchAddress).ToList();
            return GetDynamicBranches(branches);
        }

        public List<dynamic> GetDynamicBranches(List<Branch> branches)
        {
            var dynamicBranches = new List<dynamic>();
            foreach (var branch in branches)
            {
                dynamic dynamicBranch = new ExpandoObject();
                dynamicBranch.BranchId = branch.BranchId;
                dynamicBranch.BranchName = branch.BranchName;
                dynamicBranch.BranchContactNumber = branch.BranchContactNumber;
                dynamicBranch.BranchEmailAddress = branch.BranchEmailAddress;
                dynamicBranch.BranchImage = branch.BranchImage;
                dynamicBranch.BranchStatus = branch.BranchStatus;
                dynamicBranch.BranchDateCreated = branch.BranchAddress.Select(x => x.BranchDate);
                dynamicBranches.Add(dynamicBranch);
            }
            return dynamicBranches;
        }

        // Get ALL Branch Information ------------------------------------------------------------------------------------------------------------------------->
        [HttpGet]
        [Route("GetAllBranchData/{branchId}")]
        public List<dynamic> GetAllBranchDetails([FromRoute] int branchId)
        {
            var branches = db.Branch.Include(x => x.BranchAddress).Where(x => x.BranchId == branchId).ToList();
            return GetDynamicBranchDetails(branches);
        }

        public List<dynamic> GetDynamicBranchDetails(List<Branch> branches)
        {
            var dynamicBranches = new List<dynamic>();
            foreach (var branch in branches)
            {
                dynamic dynamicBranch = new ExpandoObject();
                dynamicBranch.BranchId = branch.BranchId;
                dynamicBranch.BranchName = branch.BranchName;
                dynamicBranch.BranchContactNumber = branch.BranchContactNumber;
                dynamicBranch.BranchEmailAddress = branch.BranchEmailAddress;
                dynamicBranch.BranchImage = branch.BranchImage;
                dynamicBranch.BranchStatus = branch.BranchStatus;
                dynamicBranch.BranchAddressFull = branch.BranchAddress.Select(x => x.BranchAddressFull).FirstOrDefault();
                dynamicBranch.BranchStreetAddress = branch.BranchAddress.Select(x => x.BranchStreetName).FirstOrDefault();
                dynamicBranch.BranchSuburb = branch.BranchAddress.Select(x => x.BranchSuburb).FirstOrDefault();
                dynamicBranch.BranchCity = branch.BranchAddress.Select(x => x.BranchCity).FirstOrDefault();
                dynamicBranch.BranchProvince = branch.BranchAddress.Select(x => x.BranchProvince).FirstOrDefault();
                dynamicBranch.BranchCountry = branch.BranchAddress.Select(x => x.BranchCountry).FirstOrDefault();
                dynamicBranch.BranchZip = branch.BranchAddress.Select(x => x.BranchZip).FirstOrDefault();
                dynamicBranch.BranchLate = branch.BranchAddress.Select(x => x.BranchLate).FirstOrDefault();
                dynamicBranch.BranchLng = branch.BranchAddress.Select(x => x.BranchLng).FirstOrDefault();
                dynamicBranches.Add(dynamicBranch);
            }
            return dynamicBranches;
        }

        // Get Suggested Branch Request Products -------------------------------------------------------------------------------------------------------------->
        [HttpPost]
        [Route("GetSuggestedProducts")]
        public List<dynamic> GetSuggestedProducts([FromBody] int branchId)
        {
            try
            {
                var suggestedProducts = db.BranchProduct.Include(x => x.Branch).Include(x => x.Product).ThenInclude(x => x.ProductType).Where(x => x.BranchId == branchId).ToList();
                return GetDynamicBranchRequestProducts(suggestedProducts);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicBranchRequestProducts(List<BranchProduct> suggestedProducts)
        {
            List<dynamic> dynamicSuggestedProducts = new List<dynamic>();

            foreach (var suggested in dynamicSuggestedProducts)
            {
                dynamic dynamicBranchSuggestedProduct = new ExpandoObject();

                dynamicSuggestedProducts.Add(dynamicBranchSuggestedProduct);
            }
            return dynamicSuggestedProducts;
        }

        // Get Current Branch Stock (For Specific Branch) ------------------------------------------------------------------------------------------------------>
        [HttpPost]
        [Route("GetBranchStock")]
        public List<dynamic> GetBranchStock([FromBody] int branchId)
        {
            try
            {
                var branchStock = db.BranchProduct.Include(x => x.Branch).Include(x => x.Product).ThenInclude(x => x.ProductType).Where(x => x.BranchId == branchId).ToList();
                return GetDynamicBranchStock(branchStock);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicBranchStock(List<BranchProduct> branchStock)
        {
            List<dynamic> dynamicBranchStock = new List<dynamic>();

            foreach (var stock in branchStock)
            {

                var price = db.ProductPrice.Where(x => x.BranchId == stock.BranchId && x.BranchProduct.ProductId == stock.ProductId).OrderByDescending(x => x.ProductPriceDate).FirstOrDefault(); //order by date descending, take 1
                dynamic dynamicStock = new ExpandoObject();
                dynamicStock.ProductId = stock.Product.ProductId;
                dynamicStock.ProductTypeName = stock.Product.ProductType.ProductTypeName;
                dynamicStock.ProductName = stock.Product.ProductName;
                if (price != null)
                {
                    dynamicStock.ProductPrice = price.ProductPriceAmount;
                }
                dynamicStock.QuantityOnHand = stock.Product.BranchProduct.Select(x => x.QuantityOnHand).FirstOrDefault();
                dynamicStock.BaselineQuantity = stock.Product.BranchProduct.Select(x => x.BaselineQuantity).FirstOrDefault();
                dynamicBranchStock.Add(dynamicStock);
            }
            return dynamicBranchStock;
        }

        // Get Products (All products saved on system) ------------------------------------------------------------------------------------------------------------>
        [HttpGet]
        [Route("GetProducts/{branchId}")]
        public List<dynamic> GetProducts([FromRoute] int branchId)
        {
            try
            {
                var branchProducts = db.BranchProduct.Include(x => x.Product).ThenInclude(x => x.ProductType).Where(x => x.BranchId == branchId).ToList();
                var products = db.Product.Include(x => x.ProductType).ToList();
                var result = products.Where(x => !branchProducts.Any(xx => xx.ProductId == x.ProductId)).ToList();
                return GetDynamicProducts(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicProducts(List<Product> result)
        {
            List<dynamic> dynamicProducts = new List<dynamic>();

            foreach (var item in result)
            {
                dynamic dynamicProduct = new ExpandoObject();
                dynamicProduct.ProductId = item.ProductId;
                dynamicProduct.ProductTypeName = item.ProductType.ProductTypeName;
                dynamicProduct.ProductName = item.ProductName;
                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        // Get Products for Branch Request (all MAIN products saved on system) ------------------------------------------------------------------------------------------------------------>
        [HttpGet]
        [Route("GetRequestProducts/{branchId}")]
        public List<dynamic> GetRequestProducts([FromRoute] int branchId)
        {
            try
            {
                var products = db.Product.Include(x => x.ProductType).Where(x => x.ProductTypeId == 1 || x.ProductTypeId == 3 || x.ProductTypeId == 4 || x.ProductTypeId == 5).ToList();
                return GetDynamicRequestProducts(products);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicRequestProducts(List<Product> products)
        {
            List<dynamic> dynamicProducts = new List<dynamic>();

            foreach (var item in products)
            {
                dynamic dynamicProduct = new ExpandoObject();
                dynamicProduct.ProductId = item.ProductId;
                dynamicProduct.ProductTypeName = item.ProductType.ProductTypeName;
                dynamicProduct.ProductName = item.ProductName;
                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        // Get Specific Product Information (Product Name Required) -------------------------------------------------------------------------------------------------->
        [HttpGet]
        [Route("GetProductsByName/{productName}")]
        public List<dynamic> GetProductsByName([FromRoute] string productName)
        {
            try
            {
                var specificProduct = db.Product.Include(x => x.ProductType).Include(x => x.ProductStatus).Where(x => x.ProductName == productName).ToList();
                return GetDynamicProductsByName(specificProduct);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicProductsByName(List<Product> specificProduct)
        {
            List<dynamic> dynamicProductsByName = new List<dynamic>();

            foreach (var product in specificProduct)
            {
                dynamic dynamicProductByName = new ExpandoObject();
                dynamicProductByName.ProductId = product.ProductId;
                dynamicProductByName.ProductTypeName = product.ProductType.ProductTypeName;
                dynamicProductByName.ProductName = product.ProductName;
                dynamicProductsByName.Add(dynamicProductByName);
            }

            return dynamicProductsByName;
        }

        // Update Branch Product Quantity On Hand Values (After Branch Stock Take) ----------------------------------------------------------------------------------->
        [HttpPost]
        [Route("UpdateBranchProductQuantity/{branchId}")]
        public ActionResult UpdateBranchProductQuantity([FromBody] BranchProductVM[] newProduct, [FromRoute] int branchId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    List<BranchProduct> dynamicBranchProduct = new List<BranchProduct>();

                    foreach (var item in newProduct)
                    {
                        BranchProduct obj = new BranchProduct();
                        obj = db.BranchProduct.Where(x => x.ProductId == item.ProductId && x.BranchId == branchId).FirstOrDefault();
                        if (obj != null)
                        {
                            obj.QuantityOnHand = item.EnteredQuantity.ToInt();
                        }
                        else
                        {
                            BranchProduct dynamicProducts = new BranchProduct();
                            dynamicProducts.BranchId = branchId;
                            dynamicProducts.ProductId = item.ProductId;
                            dynamicProducts.QuantityOnHand = item.QuantityOnHand;
                            dynamicProducts.BaselineQuantity = null;
                            dynamicBranchProduct.Add(dynamicProducts);
                        }
                    }

                    db.AddRange(dynamicBranchProduct);
                    db.SaveChanges();
                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Create a new Branch Stock Request and Send an email -------------------------------------------------------------------------------------------------------->
        [HttpPost]
        [Route("RequestBranchStock/{branchId}")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult RequestBranchStock([FromBody] BranchProductVM[] newRequest, [FromRoute] int branchId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    var request = new BranchRequest
                    {
                        BranchRequestDate = DateTime.Now,
                        RequestStatusId = 1,
                        BranchId = branchId
                    };
                    db.BranchRequest.Add(request);
                    db.SaveChanges();

                    var lastRequestId = db.BranchRequest.OrderByDescending(x => x.BranchRequestId).First();

                    List<BranchRequestLine> dynamicBranchRequestProduct = new List<BranchRequestLine>();

                    foreach (var item in newRequest)
                    {
                        BranchRequestLine obj = new BranchRequestLine();
                        BranchRequestLine dynamicRequestProducts = new BranchRequestLine();
                        dynamicRequestProducts.BranchRequestId = lastRequestId.BranchRequestId;
                        dynamicRequestProducts.ProductId = item.ProductId;
                        dynamicRequestProducts.RequestedQuantity = item.RequestedQuantity;
                        dynamicRequestProducts.BranchId = branchId;
                        dynamicBranchRequestProduct.Add(dynamicRequestProducts);
                    }

                    db.AddRange(dynamicBranchRequestProduct);
                    db.SaveChanges();

                    string itemsRequested = "";
                    foreach (var item in newRequest)
                    {
                        var productName = db.Product.Where(x => x.ProductId == item.ProductId).Select(x => x.ProductName).FirstOrDefault();
                        var requestedQuantities = item.RequestedQuantity;
                        itemsRequested += "- " + productName + ", Requested Quantity: " + requestedQuantities + ".<br/><br/>";
                    }

                    // Get Branch Name
                    var branchName = db.Branch.Where(x => x.BranchId == branchId).Select(x => x.BranchName).FirstOrDefault();

                    // Send Request Email
                    string email = "thomasvanvuuren7@gmail.com";
                    var subject = "New Branch Stock Request From " + branchName + " Food Works, Request ID: " + lastRequestId.BranchRequestId + ".";
                    var body = "Hello. Please see below for details regarding the new branch stock request sent on: " + DateTime.Now + "." +
                        "<br/><br/>" + "<b>Items Requested: </b>" +
                        "<br/><br/>" + itemsRequested;

                    new EmailSender().SendEmailAsync(email, subject, body);

                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Get all requests for the specified branch ------------------------------------------------------------------------------------------------------------------->
        [HttpGet]
        [Route("GetRequests/{branchId}")]
        public List<dynamic> GetRequests([FromRoute] int branchId)
        {
            try
            {
                var request = db.BranchRequest.Include(x => x.RequestStatus).Where(x => x.BranchId == branchId).ToList();
                return GetDynamicRequests(request);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicRequests(List<BranchRequest> request)
        {
            List<dynamic> dynamicBranchRequests = new List<dynamic>();

            foreach (var item in request)
            {
                dynamic dynamicRequests = new ExpandoObject();
                dynamicRequests.BranchRequestId = item.BranchRequestId;
                dynamicRequests.BranchRequestDate = item.BranchRequestDate;
                dynamicRequests.RequestStatusId = item.RequestStatus.RequestStatusDescription;
                dynamicBranchRequests.Add(dynamicRequests);
            }

            return dynamicBranchRequests;
        }

        // Get all items in a specific request
        [HttpGet]
        [Route("GetRequestList/{requestId}")]
        public List<dynamic> GetRequestList([FromRoute] int requestId)
        {
            try
            {
                var requestList = db.BranchRequestLine.Include(x => x.Product).ThenInclude(x => x.ProductType).Where(x => x.BranchRequestId == requestId).ToList();
                return GetDynamicRequestList(requestList);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<dynamic> GetDynamicRequestList(List<BranchRequestLine> requestList)
        {
            List<dynamic> dynamicBranchRequestList = new List<dynamic>();

            foreach (var item in requestList)
            {
                dynamic dynamicRequestList = new ExpandoObject();
                dynamicRequestList.ProductId = item.ProductId;
                dynamicRequestList.ProductName = item.Product.ProductName;
                dynamicRequestList.ProductTypeName = item.Product.ProductType.ProductTypeName;
                dynamicRequestList.RequestedQuantity = item.RequestedQuantity;
                dynamicBranchRequestList.Add(dynamicRequestList);
            }

            return dynamicBranchRequestList;
        }

        // Update Branch Product Quantity On Hand Values (After Branch Stock Take) ----------------------------------------------------------------------------------->
        [HttpPost]
        [Route("UpdateRequestQuantity/{branchId}/{requestId}")]
        public ActionResult UpdateRequestQuantity([FromBody] BranchProductVM[] newProduct, [FromRoute] int branchId, [FromRoute] int requestId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    List<BranchProduct> dynamicBranchProduct = new List<BranchProduct>();
                    var request = db.BranchRequest.Where(x => x.BranchRequestId == requestId).FirstOrDefault();
                    request.RequestStatusId = 3;

                    foreach (var item in newProduct)
                    {
                        BranchProduct obj = new BranchProduct();
                        obj = db.BranchProduct.Where(x => x.ProductId == item.ProductId && x.BranchId == branchId).FirstOrDefault();
                        if (obj != null)
                        {
                            obj.QuantityOnHand = obj.QuantityOnHand + item.RequestedQuantity;
                        }
                        else
                        {
                            BranchProduct dynamicProducts = new BranchProduct();
                            dynamicProducts.BranchId = branchId;
                            dynamicProducts.ProductId = item.ProductId;
                            dynamicProducts.QuantityOnHand = item.RequestedQuantity;
                            dynamicProducts.BaselineQuantity = null;
                            dynamicBranchProduct.Add(dynamicProducts);
                        }
                    }

                    db.AddRange(dynamicBranchProduct);
                    db.SaveChanges();
                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        //------------- DELETE BRANCH ---------------------------------
        [HttpPost]
        [Route("DeleteBranch")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult DeleteBranch(TypeVM v)
        {
            try
            {
                var b = db.Branch.Where(x => x.BranchId == v.ID).FirstOrDefault();
                var ba = db.BranchAddress.Where(x => x.BranchId == b.BranchId).FirstOrDefault();
                if (b.BranchProduct.Count == 0 && b.BranchRequest.Count == 0 && b.Employee.Count == 0 && b.Sale.Count == 0)
                {
                    db.BranchAddress.Remove(ba);
                    db.SaveChanges();
                    db.Branch.Remove(b);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("This branch is already in use!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //---------------------GET BRANCH NAME----------------------------------
        [HttpGet]
        [Route("GetBranchName/{branchId}")]
        public Branch GetBranchName([FromRoute] int branchId)
        {
            var branch = db.Branch.Where(x => x.BranchId == branchId).FirstOrDefault();
            return branch;
        }

        //----------------------GET BRANCH PRODUCT TO UPDATE-------------------
        [HttpPost]
        [Route("FindProduct")]

        public BranchProductVM FindProduct(BranchProductVM vm)
        {
            var bp = db.BranchProduct.Where(x => x.ProductId == vm.ProductId && x.BranchId == vm.BranchId).FirstOrDefault();
            var price = db.ProductPrice.Where(x => x.BranchId == bp.BranchId && x.BranchProduct.ProductId == bp.ProductId).OrderByDescending(x => x.ProductPriceDate).FirstOrDefault(); //order by date descending, take 1

            BranchProductVM newRole = new BranchProductVM();
            newRole.ProductId= vm.ProductId;
            newRole.BranchId = vm.BranchId;
            newRole.ProductTypeName = vm.ProductTypeName;
            if (bp.BaselineQuantity != null)
            { newRole.BaselineQuantity = (int)bp.BaselineQuantity; }
            //if(price != null || price.ProductPriceAmount != 0)
            //{
            //    newRole.ProductPrice = new ProductPrice
            //    {
            //        ProductPriceId = db.ProductPrice.Select(x => x.ProductPriceId).Max() + 1,
            //        BranchId = vm.BranchId,
            //        BranchProduct = bp,
            //        ProductPriceAmount = vm.ProductPrice.ProductPriceAmount,
            //        ProductId = vm.ProductId,
            //        ProductPriceDate = DateTime.Now,
            //    };
            //    //.ProductPriceAmount = price.ProductPriceAmount;
            //}
            if (price != null)
            {
                newRole.ProductPrice = price;
                newRole.ProductPrice.ProductPriceAmount = price.ProductPriceAmount;
            }
            return newRole;
        }

        [HttpPost]
        [Route("UpdateBP")]
        public ActionResult updateBP(UpdateBP vm)
        {
            try
            {
                var bp = db.BranchProduct.Where(x => x.ProductId == vm.ProductId && x.BranchId == vm.BranchId).FirstOrDefault();
                var price = db.ProductPrice.Where(x => x.BranchId == bp.BranchId && x.BranchProduct.ProductId == bp.ProductId).OrderByDescending(x => x.ProductPriceDate).FirstOrDefault(); //order by date descending, take 1

                bp.BaselineQuantity = vm.BaselineQuantity;
                db.SaveChanges();
                if (vm.ProductPrice != 0)
                {
                    if (price == null)
                    {
                        var newPrice = new ProductPrice
                        {
                            ProductPriceId = db.ProductPrice.Select(x => x.ProductPriceId).Max() + 1,
                            BranchId = vm.BranchId,
                            BranchProduct = bp,
                            ProductPriceAmount = vm.ProductPrice,
                            ProductId = vm.ProductId,
                            ProductPriceDate = DateTime.Now,
                        };
                        db.ProductPrice.Add(newPrice);

                    }
                    else
                    {
                        var pp = new ProductPrice
                        {
                            ProductPriceId = db.ProductPrice.Select(x => x.ProductPriceId).Max() + 1,
                            BranchId = vm.BranchId,
                            BranchProduct = bp,
                            ProductPriceAmount = vm.ProductPrice,
                            ProductId = vm.ProductId,
                            ProductPriceDate = DateTime.Now,
                        };
                        //db.ProductPrice.Add(pp);
                        //bp.ProductPrice.Add(pp);
                        price = pp;
                        bp.ProductPrice.Add(price);
                        db.SaveChanges();
                    }
                }

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        //----------------------GET Products not assigned to the branch-------------------

        [HttpGet]
        [Route("GetProductsToAssign")]
        public ActionResult getProductsToAssign()
        {
            try
            {
                var currentBranch = GlobalVariables.MyGlobalVariable.BranchId;
                var allProducts = db.Product.Include(x => x.BranchProduct).Where(x => x.ProductStatusId == 1).ToList();
                var branchProduct = db.BranchProduct.Include(x => x.Product).Where(x => x.Product.ProductStatusId == 1 && x.BranchId == currentBranch).ToList();


                List<AssignProductVM> toReturnList = new  List<AssignProductVM>();
                foreach(var product in allProducts)
                {
                    var productToCheck = db.BranchProduct.Where(x => x.ProductId == product.ProductId && x.BranchId == currentBranch).FirstOrDefault();
                    if (productToCheck != null)
                    {

                    }
                    else
                    {
                        AssignProductVM toAdd = new AssignProductVM
                        {
                            ProductId = product.ProductId,
                            ProductName = product.ProductName,
                            ProductType = db.ProductType.Where(x => x.ProductTypeId == product.ProductTypeId).Select(x => x.ProductTypeName).FirstOrDefault(),
                        };
                        toReturnList.Add(toAdd);
                    }

                    
                }

                return Ok(toReturnList);

            }
            catch
            {
                return BadRequest();
            }
            
        }
        //----------------------Write Assigned Products-------------------
        [HttpPost]
        [Route("WriteProductsAssign")]
        public ActionResult writeProductsAssign(AssignProductVM[] products)
        {
            try
            {


                foreach (var ap in products)
                {
                    int lastPriceID = db.ProductPrice.Max(x => x.ProductPriceId);
                    BranchProduct toWriteProduct = new BranchProduct()
                    {
                        BranchId = (int)GlobalVariables.MyGlobalVariable.BranchId,
                        ProductId = (int)ap.ProductId,
                        QuantityOnHand = 0,
                        BaselineQuantity = ap.BaselineQuantity


                    };
                    if (ap.ProductPriceAmount != null)
                    {
                    
                        ProductPrice toWritePrice = new ProductPrice()
                        {
                            ProductPriceId = lastPriceID + 1,
                            ProductPriceAmount = (double)ap.ProductPriceAmount,
                            ProductPriceDate = (DateTime)DateTime.Now,
                            BranchId = (int)GlobalVariables.MyGlobalVariable.BranchId,
                            ProductId = (int)ap.ProductId,
                            BranchProduct = toWriteProduct,
                        };
                            db.ProductPrice.Add(toWritePrice);
                    }
                    db.BranchProduct.Add(toWriteProduct);
                
                    db.SaveChanges();

                }
           
            return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }


}