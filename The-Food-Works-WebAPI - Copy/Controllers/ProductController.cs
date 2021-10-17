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
using The_Food_Works_WebAPI.ViewModels;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //Search for all products
        [HttpGet]
        [Route("GetProducts")]
        public List<dynamic> getProducts()
        {

                var products = db.ProductContent.Include(x => x.Product).Include(x => x.Product.ProductStatus).Include(x => x.Product.ProductType).Where(x => x.Product.ProductStatusId == 1 && x.Product.ProductTypeId == 1).OrderBy(x=>x.Product.ProductName)
                    .ToList();
                //var ingre = db.Product.Include(x => x.ProductType).Include(x => x.ProductStatus).Where(x => x.ProductStatusId == 1).ToList();
                //var products = db.Product.Include(x => x.ProductType).Include(x => x.ProductStatus).Where(x => x.ProductStatusId == 1).ToList();
                // .Where(x => x.Product.ProductTypeId == 1 || x.Product.ProductTypeId == 4 || x.Product.ProductTypeId == 5)

                return getDynamicProducts(products);
        }

        public List<dynamic> getDynamicProducts(List<ProductContent> products/*, List<Product> ingre*/)
        {
            var dynamicProducts = new List<dynamic>();

            var productGroup = products.GroupBy(x => new
            {
                x.ProductId,
                x.Product.ProductName,
                x.Product.ProductDescription,
                x.Product.ProductImage,
                x.Product.ProductType.ProductTypeName,
                x.Product.ProductBarcode
            });

            foreach (var productG in productGroup)
            {
                dynamic dynamicProduct = new ExpandoObject();
                dynamicProduct.ProductId = productG.Key.ProductId;
                dynamicProduct.ProductName = productG.Key.ProductName;
                dynamicProduct.ProductDescription = productG.Key.ProductDescription;
                dynamicProduct.ProductImage = productG.Key.ProductImage;
                dynamicProduct.ProductTypeName = productG.Key.ProductTypeName;
                dynamicProduct.ProductBarcode = productG.Key.ProductBarcode;

                List<dynamic> ingList = new List<dynamic>();
                foreach (var ing in productG)//.Where(x=>x.Key.ProductContentId == x.Key.Product.ProductId) GroupBy(x => new { x.ProductId, x.Quantity, x.Product})
                {
                    dynamic oneIng = new ExpandoObject();

                    var getcontent = db.Product.Where(x => x.ProductId == ing.ProductContentId).FirstOrDefault();

                    oneIng.ProductName = getcontent.ProductName;

                    oneIng.Quantity = ing.Quantity;

                    ingList.Add(oneIng);
                }

                dynamicProduct.contents = ingList;

                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        //get ingredients
        [HttpGet]
        [Route("GetIngredients")]
        public List<dynamic> getIngredients()
        {

                var ingre = db.Product.Include(x => x.ProductStatus).Include(x => x.ProductType).Where(x => x.ProductStatusId == 1 && x.ProductTypeId == 2).OrderBy(x => x.ProductName)
                    .ToList();

                return getDynamicIngredients(ingre);
            
        }

        public List<dynamic> getDynamicIngredients(List<Product> ingre)
        {
            var dynamicIngredients = new List<dynamic>();

            foreach (var ingredi in ingre)
            {
                dynamic dynamicIngredient = new ExpandoObject();
                dynamicIngredient.ProductId = ingredi.ProductId;
                dynamicIngredient.ProductName = ingredi.ProductName;
                dynamicIngredient.ProductDescription = ingredi.ProductDescription;
                dynamicIngredient.ProductBarcode = ingredi.ProductBarcode;
                dynamicIngredient.ProductTypeName = ingredi.ProductType.ProductTypeName;
                dynamicIngredient.ProductImage = ingredi.ProductImage;

                dynamicIngredients.Add(dynamicIngredient);
            }

            return dynamicIngredients;
        }

        //Search for all packages
        [HttpGet]
        [Route("GetPackages")]
        public List<dynamic> getPackages()
        {

                var packages = db.ProductContent.Include(x => x.Product).Include(x => x.Product.ProductStatus).Include(x => x.Product.ProductType).Where(x => x.Product.ProductStatusId == 1 && x.Product.ProductTypeId == 3).OrderBy(x => x.Product.ProductName)
                    .ToList();

                return getDynamicPackages(packages);
            
        }

        public List<dynamic> getDynamicPackages(List<ProductContent> products)
        {
            var dynamicProducts = new List<dynamic>();

            var productGroup = products.GroupBy(x => new
            {
                x.ProductId,
                x.Product.ProductName,
                x.Product.ProductDescription,
                x.Product.ProductImage,
                x.Product.ProductType.ProductTypeName,
                x.Product.ProductBarcode
            });

            foreach (var productG in productGroup)
            {
                dynamic dynamicProduct = new ExpandoObject();
                dynamicProduct.ProductId = productG.Key.ProductId;
                dynamicProduct.ProductName = productG.Key.ProductName;
                dynamicProduct.ProductDescription = productG.Key.ProductDescription;
                dynamicProduct.ProductImage = productG.Key.ProductImage;
                dynamicProduct.ProductTypeName = productG.Key.ProductTypeName;
                dynamicProduct.ProductBarcode = productG.Key.ProductBarcode;

                List<dynamic> ingList = new List<dynamic>();
                foreach (var ing in productG)
                {
                    dynamic oneIng = new ExpandoObject();

                    var getcontent = db.Product.Where(x => x.ProductId == ing.ProductContentId).FirstOrDefault();

                    oneIng.ProductName = getcontent.ProductName;

                    oneIng.Quantity = ing.Quantity;

                    ingList.Add(oneIng);
                }

                dynamicProduct.contents = ingList;

                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        //Search for all desserts
        [HttpGet]
        [Route("GetDesserts")]
        public List<dynamic> getDesserts()
        {

                var desserts = db.ProductContent.Include(x => x.Product).Include(x => x.Product.ProductStatus).Include(x => x.Product.ProductType).Where(x => x.Product.ProductStatusId == 1 && x.Product.ProductTypeId == 4).OrderBy(x => x.Product.ProductName)
                    .ToList();

                return getDynamicDesserts(desserts);

        }

        public List<dynamic> getDynamicDesserts(List<ProductContent> products)
        {
            var dynamicProducts = new List<dynamic>();

            var productGroup = products.GroupBy(x => new
            {
                x.ProductId,
                x.Product.ProductName,
                x.Product.ProductDescription,
                x.Product.ProductImage,
                x.Product.ProductType.ProductTypeName,
                x.Product.ProductBarcode
            });

            foreach (var productG in productGroup)
            {
                dynamic dynamicProduct = new ExpandoObject();
                dynamicProduct.ProductId = productG.Key.ProductId;
                dynamicProduct.ProductName = productG.Key.ProductName;
                dynamicProduct.ProductDescription = productG.Key.ProductDescription;
                dynamicProduct.ProductImage = productG.Key.ProductImage;
                dynamicProduct.ProductTypeName = productG.Key.ProductTypeName;
                dynamicProduct.ProductBarcode = productG.Key.ProductBarcode;

                List<dynamic> ingList = new List<dynamic>();
                foreach (var ing in productG)
                {
                    dynamic oneIng = new ExpandoObject();

                    var getcontent = db.Product.Where(x => x.ProductId == ing.ProductContentId).FirstOrDefault();

                    oneIng.ProductName = getcontent.ProductName;

                    oneIng.Quantity = ing.Quantity;

                    ingList.Add(oneIng);
                }

                dynamicProduct.contents = ingList;

                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        //Search for all sides
        [HttpGet]
        [Route("GetSides")]
        public List<dynamic> getSides()
        {

                var sides = db.ProductContent.Include(x => x.Product).Include(x => x.Product.ProductStatus).Include(x => x.Product.ProductType).Where(x => x.Product.ProductStatusId == 1 && x.Product.ProductTypeId == 5).OrderBy(x => x.Product.ProductName)
                    .ToList();

                return getDynamicSides(sides);

        }

        public List<dynamic> getDynamicSides(List<ProductContent> products)
        {
            var dynamicProducts = new List<dynamic>();

            var productGroup = products.GroupBy(x => new
            {
                x.ProductId,
                x.Product.ProductName,
                x.Product.ProductDescription,
                x.Product.ProductImage,
                x.Product.ProductType.ProductTypeName,
                x.Product.ProductBarcode
            });

            foreach (var productG in productGroup)
            {
                dynamic dynamicProduct = new ExpandoObject();
                dynamicProduct.ProductId = productG.Key.ProductId;
                dynamicProduct.ProductName = productG.Key.ProductName;
                dynamicProduct.ProductDescription = productG.Key.ProductDescription;
                dynamicProduct.ProductImage = productG.Key.ProductImage;
                dynamicProduct.ProductTypeName = productG.Key.ProductTypeName;
                dynamicProduct.ProductBarcode = productG.Key.ProductBarcode;

                List<dynamic> ingList = new List<dynamic>();
                foreach (var ing in productG)
                {
                    dynamic oneIng = new ExpandoObject();

                    var getcontent = db.Product.Where(x => x.ProductId == ing.ProductContentId).FirstOrDefault();

                    oneIng.ProductName = getcontent.ProductName;

                    oneIng.Quantity = ing.Quantity;

                    ingList.Add(oneIng);
                }

                dynamicProduct.contents = ingList;

                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        // Get product types
        [HttpGet]
        [Route("GetTypes")]
        public List<dynamic> getProductTypes()
        {
            var productTypes = db.ProductType.ToList();

            return GetDynamicProductTypes(productTypes);
        }

        public List<dynamic> GetDynamicProductTypes(List<ProductType> productTypes)
        {
            var dynamicProductTypes = new List<dynamic>();

            foreach (var productType in productTypes)
            {
                dynamic dynamicproductType = new ExpandoObject();
                dynamicproductType.ProductTypeId = productType.ProductTypeId;
                dynamicproductType.ProductTypeName = productType.ProductTypeName;

                dynamicProductTypes.Add(dynamicproductType);
            }

            return dynamicProductTypes;
        }

        // Get product statuses
        [HttpGet]
        [Route("GetStatuses")]
        public List<dynamic> getProductStatuses()
        {
            var productStatuses = db.ProductStatus.ToList();

            return GetDynamicProductStatuses(productStatuses);
        }

        public List<dynamic> GetDynamicProductStatuses(List<ProductStatus> productStatuses)
        {
            var dynamicProductStatuses = new List<dynamic>();

            foreach (var productStatus in productStatuses)
            {
                dynamic dynamicProductStatus = new ExpandoObject();
                dynamicProductStatus.ProductStatusId = productStatus.ProductStatusId;
                dynamicProductStatus.ProductStatusName = productStatus.ProductStatusName;

                dynamicProductStatuses.Add(dynamicProductStatus);
            }

            return dynamicProductStatuses;
        }

        //get list of products only
        [HttpGet]
        [Route("GetProductsOnly")]
        public List<dynamic> getProductsOnly()
        {
            var allProducts = db.Product.Where(x => x.ProductStatusId == 1).Where(x => x.ProductTypeId != 2).OrderBy(x => x.ProductName).ToList();

            return GetDynamicProductsOnly(allProducts);
        }

        public List<dynamic> GetDynamicProductsOnly(List<Product> allProducts)
        {
            var dynamicProductsOnly = new List<dynamic>();

            foreach (var product in allProducts)
            {
                dynamic dynamicProductOnly = new ExpandoObject();
                dynamicProductOnly.ProductId = product.ProductId;
                dynamicProductOnly.ProductName = product.ProductName;

                dynamicProductsOnly.Add(dynamicProductOnly);
            }

            return dynamicProductsOnly;
        }

        //ADD PRODUCT
        [HttpPost]
        [Route("AddProduct")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult addProduct(ProductVM product)
        {
            try
            {
                //check if Barcode already exists
                if (product.ProductBarcode != "")
                {
                    var check = db.Product.Where(zz => zz.ProductBarcode == product.ProductBarcode).FirstOrDefault();
                    if (check != null)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        int productId = db.Product.Max(x => x.ProductId);
                        var newProduct = new Product
                        {
                            ProductId = productId + 1,
                            ProductName = product.ProductName,
                            ProductDescription = product.ProductDescription,
                            ProductBarcode = product.ProductBarcode,
                            ProductTypeId = product.ProductTypeId,
                            ProductStatusId = 1,
                            ProductImage = product.ProductImage,
                        };

                        db.Product.Add(newProduct);

                        db.SaveChanges();

                        if (product.contents != null)
                        {
                            var contentsToAdd = product.contents;

                            for (int i = 0; i < contentsToAdd.Count(); i++)
                            {
                                var newContent = new ProductContent
                                {
                                    ProductId = productId + 1,
                                    ProductContentId = contentsToAdd[i].ProductId,
                                    Quantity = contentsToAdd[i].Quantity
                                };

                                db.ProductContent.Add(newContent);
                                db.SaveChanges();
                            }
                        }
                    }
                }
                else if(product.ProductBarcode == "")
                {
                    var check = db.Product.Where(zz => zz.ProductName == product.ProductName).FirstOrDefault();
                    if (check != null)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        int productId = db.Product.Max(x => x.ProductId);
                        var newProduct = new Product
                        {
                            ProductId = productId + 1,
                            ProductName = product.ProductName,
                            ProductDescription = product.ProductDescription,
                            //ProductBarcode = product.ProductBarcode,
                            ProductTypeId = product.ProductTypeId,
                            ProductStatusId = 1,
                            //ProductImage = product.ProductImage,
                        };

                        db.Product.Add(newProduct);

                        db.SaveChanges();
                    }

                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }

        //Get specific product
        [HttpPost]
        [Route("GetOneProduct")]
        public ProductVM getOneProduct(ProductVM productName)
        {

                var getProduct = db.Product.Include(x => x.ProductType).Include(x => x.ProductStatus).Where(zz => zz.ProductName == productName.ProductName).FirstOrDefault();
                int statusId = getProduct.ProductStatusId;
                var itemContents = db.ProductContent.Include(x => x.Product).Where(x => x.ProductId == getProduct.ProductId).ToList();

                ProductVM vm = new ProductVM();
                vm.ProductId = getProduct.ProductId;
                vm.ProductName = getProduct.ProductName;
                vm.ProductBarcode = getProduct.ProductBarcode;
                vm.ProductDescription = getProduct.ProductDescription;
                vm.ProductImage = getProduct.ProductImage;
                vm.ProductStatusId = db.ProductStatus.Where(x => x.ProductStatusId == statusId).Select(x => x.ProductStatusId).FirstOrDefault();
                vm.ProductTypeId = db.ProductType.Where(x => x.ProductTypeId == getProduct.ProductTypeId).Select(x => x.ProductTypeId).FirstOrDefault();

                if (vm.ProductTypeId != 2)
                {
                    List<ProductContent> pCon = new List<ProductContent>(); 

                    List<int> pNames = new List<int>();
                    List<string> cNames = new List<string>();
                    foreach (var content in itemContents)
                    {
                        int currentName = db.Product.Where(x => x.ProductId == content.ProductContentId).Select(x => x.ProductId).FirstOrDefault();
                        string contentName = db.Product.Where(x => x.ProductId == content.ProductContentId).Select(x => x.ProductName).FirstOrDefault();

                        cNames.Add(contentName);

                        pNames.Add(currentName);

                        pCon.Add(content);
                    }

                    List<double> quantities = new List<double>();
                    foreach (var content in itemContents)
                    {
                        double currentQuantity = (double)content.Quantity;
                        quantities.Add(currentQuantity);
                    }

                    vm.ProductNames = pNames;
                    vm.Quantities = quantities;
                    vm.conList = pCon;
                    vm.contentNames = cNames;
                }

                return vm;

        }

        [HttpPost]
        [Route("GetCurrentIngredients")]
        public List<CurrentVM> getCurrentIngredients(ProductVM productId)
        {

                var getAllIngredients = db.Product.Where(x => x.ProductTypeId == 2).OrderBy(x=>x.ProductName).ToList();

                var getAllCurrentContents = db.ProductContent.Where(x => x.ProductId == productId.ProductId).OrderBy(x=>x.Product.ProductName).ToList();

                List<CurrentVM> toSend = new List<CurrentVM>();


                for (int i = 0; i < getAllIngredients.Count(); i++)
                {

                    CurrentVM sending = new CurrentVM() { };

                    if (getAllCurrentContents.Count() == 0)
                    {
                        sending.ProductId = productId.ProductId;
                        sending.ProductName = getAllIngredients[i].ProductName;
                        sending.ProductContentId = getAllIngredients[i].ProductId;
                    }
                    else
                    {
                        for (int j = 0; j < getAllCurrentContents.Count(); j++)
                        {

                            if (getAllIngredients[i].ProductId == getAllCurrentContents[j].ProductContentId)
                            {
                                sending.ProductId = productId.ProductId;
                                sending.ProductName = getAllIngredients[i].ProductName;
                                sending.ProductContentId = getAllIngredients[i].ProductId;
                                sending.Quantity = (double)getAllCurrentContents[j].Quantity;
                            }
                            else
                            {
                                sending.ProductId = productId.ProductId;
                                sending.ProductName = getAllIngredients[i].ProductName;
                                sending.ProductContentId = getAllIngredients[i].ProductId;
                                //sending.Quantity = 0;
                            }

                        }
                    }
                    

                    toSend.Add(sending);

                }

                return toSend;

        }


        [HttpPost]
        [Route("GetCurrentProducts")]
        public List<CurrentVM> getCurrentProducts(ProductVM productId)
        {

                var getAllIngredients = db.Product.Where(x => x.ProductTypeId != 2 && x.ProductTypeId != 3).OrderBy(x => x.ProductName).ToList();

                var getAllCurrentContents = db.ProductContent.Where(x => x.ProductId == productId.ProductId).OrderBy(x => x.Product.ProductName).ToList();

                List<CurrentVM> toSend = new List<CurrentVM>();


                for (int i = 0; i < getAllIngredients.Count(); i++)
                {

                    CurrentVM sending = new CurrentVM() { };

                    if (getAllCurrentContents.Count() == 0)
                    {
                        sending.ProductId = productId.ProductId;
                        sending.ProductName = getAllIngredients[i].ProductName;
                        sending.ProductContentId = getAllIngredients[i].ProductId;
                    }
                    else 
                    {
                        for (int j = 0; j < getAllCurrentContents.Count(); j++)
                        {

                            if (getAllIngredients[i].ProductId == getAllCurrentContents[j].ProductContentId)
                            {
                                sending.ProductId = productId.ProductId;
                                sending.ProductName = getAllIngredients[i].ProductName;
                                sending.ProductContentId = getAllIngredients[i].ProductId;
                                sending.Quantity = (double)getAllCurrentContents[j].Quantity;
                            }
                            else
                            {
                                sending.ProductId = productId.ProductId;
                                sending.ProductName = getAllIngredients[i].ProductName;
                                sending.ProductContentId = getAllIngredients[i].ProductId;
                                //sending.Quantity = 0;
                            }

                        }
                    }

                    
                    toSend.Add(sending);

                }

                return toSend;

        }

        [HttpPut]
        [Route("UpdateProduct")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult updateProduct(ProductVM pVM)//send whole model from angular to api
        {
            try
            {
                var productToUpdate = db.Product.Where(zz => zz.ProductId == pVM.ProductId).FirstOrDefault();

                productToUpdate.ProductName = pVM.ProductName;
                productToUpdate.ProductDescription = pVM.ProductDescription;
                productToUpdate.ProductStatusId = pVM.ProductStatusId;
                productToUpdate.ProductTypeId = pVM.ProductTypeId;

                if (pVM.ProductBarcode != null || pVM.ProductBarcode != "")
                {
                    productToUpdate.ProductBarcode = pVM.ProductBarcode;
                }

                if (pVM.ProductBarcode != null || pVM.ProductBarcode != "")
                {
                    productToUpdate.ProductImage = pVM.ProductImage;
                }

                
                db.SaveChanges();

                if (pVM.contents != null)
                {
                    var contentsToAdd = pVM.contents;
                    var currentContents = db.ProductContent.Where(x => x.ProductId == pVM.ProductId).ToList();

                    for (int i = 0; i < currentContents.Count(); i++)
                    {
                        db.Remove(currentContents[i]);

                        db.SaveChanges();
                    }

                    for (int i = 0; i < contentsToAdd.Count(); i++)
                    {
                        var newContent = new ProductContent
                        {
                            ProductId = pVM.ProductId,
                            ProductContentId = contentsToAdd[i].ProductId,
                            Quantity = contentsToAdd[i].Quantity
                        };

                        db.ProductContent.Add(newContent);
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

        //------------- DELETE PRODUCT ---------------------------------
        [HttpPost]
        [Route("DeleteProduct")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult DeleteProduct(ProductVM v)
        {
            try
            {
                var b = db.Product.Where(x => x.ProductId == v.ProductId).FirstOrDefault();
                var pp = db.ProductPrice.Where(x => x.ProductId == b.ProductId).FirstOrDefault();
                var bp = db.BranchProduct.Where(x => x.ProductId == b.ProductId).FirstOrDefault();
                var pc = db.ProductContent.Where(x => x.ProductContentId == b.ProductId).ToList();
                var productInProductContent = db.ProductContent.Where(x => x.ProductId == b.ProductId).ToList();
                var pr = db.ProductReview.Where(x => x.ProductId == b.ProductId).FirstOrDefault();
                if (b.BranchProduct.Count == 0 && b.BranchRequestLine.Count == 0 && b.BatchLine.Count == 0)
                {
                    if (pc != null)
                    {
                        for (int i = 0; i < pc.Count(); i++)
                        {
                            db.Remove(pc[i]);

                            db.SaveChanges();
                        }
                    }
                    if (productInProductContent != null)
                    {
                        for (int i = 0; i < productInProductContent.Count(); i++)
                        {
                            db.Remove(productInProductContent[i]);

                            db.SaveChanges();
                        }
                    }
                    if (bp != null)
                    {
                        db.BranchProduct.Remove(bp);
                    }
                    if (pr != null)
                    {
                        db.ProductReview.Remove(pr);
                    }
                    if (pp != null)
                    {
                        db.ProductPrice.Remove(pp);
                    }
                    db.SaveChanges();
                    db.Product.Remove(b);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("This product cannot be deleted just yet!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}