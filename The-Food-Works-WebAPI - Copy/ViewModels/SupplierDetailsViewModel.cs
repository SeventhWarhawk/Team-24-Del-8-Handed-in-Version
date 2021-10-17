using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;


namespace The_Food_Works_WebAPI.ViewModels
{

    public class SupplierVM
    {
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public string? SupplierVatNumber { get; set; }
        public string? SupplierContactNumber { get; set; }
        public string? SupplierEmailAddress { get; set; }
        public int SupplierTypeID { get; set; }
        public string SupplierTypeName { get; set; }
        public int? SupplierStatusID { get; set; }
        public int? SupplierAddressId { get; set; }
        public int OrderMethodID { get; set; }
        public  SupplierOrderDay[] orderDays { get; set; }
        public string[] days { get; set; }
        //public List<Address> address {get;set;}

    }

    public class AddressVM
    {
        public int? SupplierId { get; set; }
        public int? SupplierAddressId { get; set; }
        public string? SupplierAddressBuildingNumber { get; set; }
        public string SupplierAddressStreetName { get; set; }
        public string SupplierAddressSuburb { get; set; }
        public string SupplierAddressProvince { get; set; }

        public string SupplierAddressCity { get; set; }
        public string SupplierAddressCountry { get; set; }
        public string SupplierAddressZip { get; set; }
        public string SupplierAddressFull { get; set; }
        public float SupplierAddressLat { get; set; }
        public float SupplierAddressLng { get; set; }
    }

    public class OrderDayVM
    {
        public int? SupplierId { get; set; }
        public string SupplierOrderDayDescription { get; set; }
    }

    public class SupplierCombinedVM
    {
        public SupplierVM supplier { get; set; }
        public AddressVM address { get; set; }
    }


    public class SuppAdd
    {
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public string? SupplierVatNumber { get; set; }
        public string? SupplierContactNumber { get; set; }
        public string? SupplierEmailAddress { get; set; }
        public int SupplierTypeID { get; set; }
        public int SupplierStatusID { get; set; }
        public int OrderMethodID { get; set; }
        public SupplierOrderDay[] orderDays { get; set; }


    }

}
