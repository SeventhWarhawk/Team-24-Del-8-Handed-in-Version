using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class Data
    {
        public class AuthVM
        {
            public string EmailAddress { get; set; }
            public string Password { get; set; }
            public int BranchId { get; set; }
        }

        public class UserInfoVM
        {
            public string EmailAddress { get; set; }
            public string DisplayName { get; set; }
            public string FirstName { get; set; }
            public int? BranchId { get; set; }
            public string BranchName { get; set; }
            public int? EmployeeId { get; set; }
            public int? CustomerId { get; set; }
            public string MobileToken { get; set; }
            public string ExpiresIn { get; set; }
            public string[] Roles { get; set; }
        }

        public class BranchVM
        {
            public string BranchName { get; set; }
            public string BranchContactNumber { get; set; }
            public string BranchEmailAddress { get; set; }
            public string BranchImage { get; set; }
            public bool BranchStatus { get; set; }
        }

        public class BranchAddressVM
        {
            public string BranchAddressFull { get; set; }
            public string BranchStreetName { get; set; }
            public string BranchSuburb { get; set; }
            public string BranchCity { get; set; }
            public string BranchProvince { get; set; }
            public string BranchCountry { get; set; }
            public string BranchZip { get; set; }
            public string BranchDate { get; set; }
            public float BranchLate { get; set; }
            public float BranchLng { get; set; }
            public int BranchId { get; set; }
        }

        public class BranchUpdateVM
        {
            public string BranchName { get; set; }
            public string BranchContactNumber { get; set; }
            public string BranchEmailAddress { get; set; }
            public string BranchImage { get; set; }
            public bool BranchStatus { get; set; }
            public string BranchAddressFull { get; set; }
            public string BranchStreetName { get; set; }
            public string BranchSuburb { get; set; }
            public string BranchCity { get; set; }
            public string BranchProvince { get; set; }
            public string BranchCountry { get; set; }
            public string BranchZip { get; set; }
            public string BranchDate { get; set; }
            public float BranchLate { get; set; }
            public float BranchLng { get; set; }
            public int BranchId { get; set; }
        }

        public class BranchesVM
        {
            public BranchVM branch { get; set; }
            public BranchAddressVM address { get; set; }
        }

        public class BranchProductVM
        {
            public int? BaselineQuantity { get; set; }
            public ProductPrice? ProductPrice { get; set; }
            public bool CanDelete { get; set; }
            public bool Confirmed { get; set; }
            public string EnteredQuantity { get; set; }
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public string ProductTypeName { get; set; }
            public int QuantityOnHand { get; set; }
            public int BranchId { get; set; }
            public int RequestedQuantity { get; set; }
        }

        public class UpdateBP
        {
            public int BranchId { get; set; }
            public int ProductId { get; set; }
            public int? BaselineQuantity { get; set; }
            public double ProductPrice { get; set; }
        }

        public class CustomerVM
        {
            public int? CustomerID { get; set; }
            public string CustomerName { get; set; }
            public string CustomerSurname { get; set; }
            public DateTime CustomerDob { get; set; }
            public string CustomerTelephone { get; set; }
            public string CustomerEmail { get; set; }
            public bool IsLoyaltyProgram { get; set; }
            public string StreetNumber { get; set; }
            public string StreetName { get; set; }
            public string City { get; set; }
            public string PostalCode { get; set; }
            public string Province { get; set; }
            public float? Lat { get; set; }
            public float? Lng { get; set; }

            public string Password { get; set; }
        }

        public class ForgotPasswordVM
        {
            [EmailAddress]
            public string Email { get; set; }
        }

        public class ResetPasswordVM
        {
            public int? CustomerID { get; set; }
            public string CurrentPassword { get; set; }
            public string email { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmPassword { get; set; }
        }

        public class ResetForgottenPasswordVM
        {
            public string email { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmPassword { get; set; }
        }

        public class UserRoleVM
        {
            public int? ID { get; set; }
            public string name { get; set; }
            public string description { get; set; }
        }

        public class OTPvm
        {
            public string user { get; set; }
            public int OTP { get; set; }
        }

        public class ProductVM
        {
            public int ID { get; set; }
            public string name { get; set; }
            public string description { get; set; }
            public int QOH { get; set; }
        }

        public class WriteOffVM
        {
            public int productId { get; set; }
            public int branchId { get; set; }
            public string WOReason { get; set; }
            public int WOQuantity { get; set; }
        }

        public class SelectedProductVM
        {
            public int SelectedId { get; set; }
            public int BranchId { get; set; }
        }

        public class ReportVM
        {
            public int BranchId { get; set; }

            public DateTime endDate { get; set; }
        }

        public class ProductReportVM
        {
            public int BranchId { get; set; }
            public DateTime startDate { get; set; }

            public DateTime endDate { get; set; }
        }

        public class SupplierVM
        {
            public int id { get; set; }
            public string? name { get; set; }
            public string? description { get; set; }
        }

        public class BusinessRulesVM
        {
            public int vat { get; set; }
        }

        public class AuditVM
        {
            public int Id { get; set; }
            public DateTime TimeStamp { get; set; }
            public int? UserId { get; set; }
            public string Controller { get; set; }
            public string Action { get; set; }
            public string QueryString { get; set; }
            public string RequestBody { get; set; }
            public string Username { get; set; }
        }

        public class DashboardSaleVM
        {
            public DateTime date { get; set; }
            public double total { get; set; }
        }

        public class DashboardPopularVM
        {
            public string productName { get; set; }
            public int quantiy { get; set; }
        }

        public class OrderedHitsVM
        { 
            public string productName { get; set; }
            public int totalOrdered { get; set; }
            public int orderFrequency { get; set; }
        }

        public class WriteOffHistoryVM
        {
            public DateTime date { get; set; }
            public string productName { get; set; }
            public string WOReason { get; set; }
            public int WOQuantity { get; set; }
        }

    }
}