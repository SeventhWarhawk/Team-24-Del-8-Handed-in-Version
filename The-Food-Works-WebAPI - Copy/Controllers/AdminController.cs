using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
    public class AdminController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("getAllUserRoles")]
        public List<dynamic> getUserRoles()
        {
            var userRoles = db.UserRole.ToList();
            return getDynamicUserRole(userRoles);
        }

        public List<dynamic> getDynamicUserRole(List<UserRole> userRoles)
        {
            var dynamicUserRoles = new List<dynamic>();

            foreach (var userRole in userRoles)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.UserRoleId = userRole.UserRoleId;
                dynamicUserRole.UserRoleName = userRole.UserRoleName;
                dynamicUserRole.UserRoleDescription = userRole.UserRoleDescription;
                dynamicUserRoles.Add(dynamicUserRole);
            }

            return dynamicUserRoles;
        }

        [HttpPost]
        [Route("AddUserRole")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult addUserRole(UserRoleVM userRole)
        {
            try
            {
                var id = db.UserRole.Select(x => x.UserRoleId).Max();
                if (db.UserRole.Where(x => x.UserRoleName == userRole.name).FirstOrDefault() == null)
                {
                    var newUserRole = new UserRole
                    {
                        // UserRoleId = id + 1,
                        UserRoleName = userRole.name,
                        UserRoleDescription = userRole.description
                    };

                    db.UserRole.Add(newUserRole);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }

                
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("UpdateUserRole")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult updateUserRole(UserRoleVM updatedRole)
        {
            try
            {
                var roleToUpdate = db.UserRole.Where(x => x.UserRoleId == updatedRole.ID).FirstOrDefault();
                roleToUpdate.UserRoleName = updatedRole.name;
                roleToUpdate.UserRoleDescription = updatedRole.description;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("FindUserRole")]
        public UserRoleVM FindUserRole(UserRoleVM vm)
        {
            var role = db.UserRole.Where(x => x.UserRoleId == vm.ID).FirstOrDefault();
            UserRoleVM newRole = new UserRoleVM();
            newRole.ID = role.UserRoleId;
            newRole.name = role.UserRoleName;
            newRole.description = role.UserRoleDescription;
            return newRole;
        }

        [HttpPost]
        [Route("DeleteRole")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult DeleteRole(TypeVM v)
        {
            try
            {
                var type = db.UserRole.Where(x => x.UserRoleId == v.ID).FirstOrDefault();
                var emp = db.User.Where(x => x.UserRole == type).FirstOrDefault();
                if (type.User.Count == 0 || type.User == null || emp == null)
                {
                    db.UserRole.Remove(type);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("Users with this role already exist!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // -----------WRITE OFF -----------------------------------------------------------
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public List<dynamic> getDynamicProducts(List<Product> products)
        {
            var dynamicProducts = new List<dynamic>();

            foreach (var product in products)
            {
                dynamic dynamicproduct = new ExpandoObject();

                dynamicproduct.ID = product.ProductId;

                dynamicproduct.name = product.ProductName;

                dynamicproduct.description = product.ProductDescription;

                var branchP = db.BranchProduct.Where(x => x.ProductId == product.ProductId && x.BranchId == 1).FirstOrDefault();

                if (branchP != null)
                    dynamicproduct.QOH = branchP.QuantityOnHand;
                else
                    dynamicproduct.QOH = 0;

                dynamicProducts.Add(dynamicproduct);
            }
            return dynamicProducts;
        }

        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpGet]
        [Route("GetAllBranchProducts")]
        public List<dynamic> getAllBranchProducts()
        {
            var branchProducts = new List<dynamic>();
            var branches = db.Branch.ToList();
            foreach (var b in branches)
            {
                dynamic branch = new ExpandoObject();
                branch.Name = b.BranchName;
                branch.ID = b.BranchId;
                var tmpBP = db.BranchProduct
                    .Include(bp => bp.Product)
                    .Where(p => p.BranchId == b.BranchId)
                    .Select(o => new
                    {
                        ID = o.ProductId,
                        name = o.Product.ProductName,
                        description = o.Product.ProductDescription,
                        QOH = o.QuantityOnHand
                    })
                    .ToList();

                branch.Products = tmpBP;
                branchProducts.Add(branch);
            }
            return branchProducts;
        }

        private List<Product> WOproducts = new List<Product>();

        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("FindProduct")]
        public List<Product> FindProduct(SelectedProductVM[] vm)
        {
            for (int i = 0; i < vm.Length; i++)
            {
                // var product = db.BranchProduct.Where(y => y.BranchId == vm[i].BranchId && y.ProductId == vm[i].SelectedId).FirstOrDefault();
                var product = db.Product
                    .Where(x => x.ProductId == vm[i].SelectedId)
                    .FirstOrDefault();

                WOproducts.Add(product);
            }
            return WOproducts;
        }

        [HttpPost]
        [Route("ValidateWO")]
        public bool ValidateWO(WriteOffVM vm)
        {
            var product = db.BranchProduct.Where(x => x.ProductId == vm.productId).FirstOrDefault();
            if (vm.WOQuantity <= product.QuantityOnHand && vm.WOQuantity > 0)
            {
                return true;
            }
            else
                return false;
        }

        [HttpPost]
        [Route("FinalWriteOff")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult FinalWriteOff(WriteOffVM[] list)
        {
            try
            {
                foreach (var vm in list)
                {
                    var id = db.WriteOff.Select(x => x.WriteOffId).Max();
                    var newWO = new WriteOff
                    {
                        WriteOffId = id + 1,
                        WriteOffDate = DateTime.Now,
                    };

                    db.WriteOff.Add(newWO);

                    BranchProduct bp = db.BranchProduct.Where(x => x.BranchId == vm.branchId && x.ProductId == vm.productId).FirstOrDefault();
                    Product product = bp.Product;
                    //db.Product.Where(x => x.ProductId == vm.productId).FirstOrDefault();
                    var newPWO = new WriteOffProduct
                    {
                        WriteOffId = db.WriteOffProduct.Select(x => x.WriteOffId).Max(),
                        WriteOffQuantity = vm.WOQuantity,
                        WriteOffReason = vm.WOReason,
                        ProductId = vm.productId,
                        BranchId = vm.branchId,
                        Product = product,
                        WriteOff = newWO,
                        WriteOffDate = newWO.WriteOffDate,
                    };
                    db.WriteOffProduct.Add(newPWO);
                    bp.QuantityOnHand = bp.QuantityOnHand - newPWO.WriteOffQuantity;
                    db.SaveChanges();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // -------------AUDIT----------------------------------------------------------
        [HttpGet]
        [Route("GetAllAudits")]
        public List<AuditVM> GetAllAudits()
        {
            List<AuditVM> returnMe = new List<AuditVM>();
            var list = db.Audit.ToList();
            foreach (var a in list)
            {
                AuditVM obj = new AuditVM
                {
                    Username = db.User.Where(x => x.UserId == a.UserId).Select(x => x.UserUsername).FirstOrDefault(),
                    Action = a.Action,
                    Controller = a.Controller,
                    TimeStamp = a.TimeStamp,
                    Id = a.Id,
                    UserId = a.UserId,
                    RequestBody = a.RequestBody,
                    QueryString = a.QueryString
                };
                returnMe.Add(obj);
            }

            return returnMe;
        }

        [HttpGet]
        [Route("GetAuditsToday")]
        public List<Audit> GetAuditsToday()
        {
            try
            {
                List<Audit> list = new List<Audit>();
                list = db.Audit.Where(x => x.TimeStamp.Date == DateTime.Today.Date && x.QueryString == GlobalVariables.MyGlobalVariable.BranchName).ToList();
                return list;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // -------------------- PRODUCT TYPE CRUD -----------------------------------------------------

        [HttpGet]
        [Route("getAllProductTypes")]
        public List<dynamic> getProductTypes()
        {
            var productTypes = db.ProductType.ToList();
            return getDynamicProductType(productTypes);
        }

        public List<dynamic> getDynamicProductType(List<ProductType> productTypes)
        {
            var dynamicproductTypes = new List<dynamic>();

            foreach (var userRole in productTypes)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.ProductTypeId = userRole.ProductTypeId;
                dynamicUserRole.ProductTypeName = userRole.ProductTypeName;
                dynamicproductTypes.Add(dynamicUserRole);
            }

            return dynamicproductTypes;
        }

        [HttpPost]
        [Route("AddProductType")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult addProductType(TypeVM userRole)
        {
            try
            {
                var id = db.ProductType.Select(x => x.ProductTypeId).Max();
                var newUserRole = new ProductType
                {
                    ProductTypeId = id + 1,
                    ProductTypeName = userRole.name
                };

                db.ProductType.Add(newUserRole);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("UpdateProductType")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult updateProductType(TypeVM updatedRole)
        {
            try
            {
                var roleToUpdate = db.ProductType.Where(x => x.ProductTypeId == updatedRole.ID).FirstOrDefault();
                roleToUpdate.ProductTypeName = updatedRole.name;
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("FindProductType")]
        public TypeVM FindProductType(TypeVM vm)
        {
            var role = db.ProductType.Where(x => x.ProductTypeId == vm.ID).FirstOrDefault();
            TypeVM newRole = new TypeVM();
            newRole.ID = role.ProductTypeId;
            newRole.name = role.ProductTypeName;
            return newRole;
        }

        [HttpPost]
        [Route("DeleteType")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult DeleteType(TypeVM v)
        {
            try
            {
                var type = db.ProductType.Where(x => x.ProductTypeId == v.ID).FirstOrDefault();
                if (type.Product.Count == 0)
                {
                    db.ProductType.Remove(type);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("Products of this type already exist!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // ---------------------- SUPPLIER TYPE CRUD ------------------------
        [HttpGet]
        [Route("getAllSupplierTypes")]
        public List<dynamic> getSupplierTypes()
        {
            var SupplierTypes = db.SupplierType.ToList();
            return getDynamicSupplierType(SupplierTypes);
        }

        public List<dynamic> getDynamicSupplierType(List<SupplierType> SupplierTypes)
        {
            var dynamicSupplierTypes = new List<dynamic>();

            foreach (var userRole in SupplierTypes)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.SupplierTypeId = userRole.SupplierTypeId;
                dynamicUserRole.SupplierTypeName = userRole.SupplierTypeName;
                dynamicSupplierTypes.Add(dynamicUserRole);
            }

            return dynamicSupplierTypes;
        }

        [HttpPost]
        [Route("AddSupplierType")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult addSupplierType(TypeVM userRole)
        {
            try
            {
                var check = db.SupplierType.Where(x => x.SupplierTypeName == userRole.name).ToList();
                if (check.Count <= 0)
                {
                    var id = db.SupplierType.Select(x => x.SupplierTypeId).Max();
                    var newUserRole = new SupplierType
                    {
                        SupplierTypeId = id + 1,
                        SupplierTypeName = userRole.name
                    };

                    db.SupplierType.Add(newUserRole);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("This type already exists!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("UpdateSupplierType")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult updateSupplierType(TypeVM updatedRole)
        {
            try
            {
                var roleToUpdate = db.SupplierType.Where(x => x.SupplierTypeId == updatedRole.ID).FirstOrDefault();
                roleToUpdate.SupplierTypeName = updatedRole.name;
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("FindSupplierType")]
        public TypeVM FindSupplierType(TypeVM vm)
        {
            var role = db.SupplierType.Where(x => x.SupplierTypeId == vm.ID).FirstOrDefault();
            TypeVM newRole = new TypeVM();
            newRole.ID = role.SupplierTypeId;
            newRole.name = role.SupplierTypeName;
            return newRole;
        }

        [HttpPost]
        [Route("DeleteSupplierType")]
        [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult DeleteSupplierType(TypeVM v)
        {
            try
            {
                var type = db.SupplierType.Where(x => x.SupplierTypeId == v.ID).FirstOrDefault();
                var check = db.Supplier.Where(x => x.SupplierTypeId == v.ID).ToList();
                if (check.Count <= 0)
                {
                    db.SupplierType.Remove(type);
                    db.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("Suppliers of this type already exist!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //------------------ADJUST BUSINESS RULES------------------------------------------
        [HttpPost]
        [Route("AdjustBusinessRules")]
        public ActionResult AdjustBusinessRules(BusinessRulesVM br)
        {
            try
            {
                var date = DateTime.Now;
                var id = db.Vat.Select(x => x.VatId).Max();
                var currentVAT = new Vat();
                currentVAT.VatId = id + 1;
                currentVAT.VatDate = date;
                currentVAT.VatPercentage = br.vat;

                db.Vat.Add(currentVAT);
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