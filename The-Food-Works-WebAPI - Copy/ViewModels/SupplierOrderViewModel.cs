using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class SupplierOrderViewModel
    {
        public int SupplierOrderId { get; set; }
        public string SupplierVatNumber { get; set; }
        public string InvoiceImage { get; set; }
        public int SupplierId {get;set;}
        public List<string> productNames { get; set; }
        public List<int> quantities { get; set; }
        public int OrderStatusId { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        //public int ProductContentId { get; set; }
        public SupplierOrderLine[] orderLines { get; set; }
        public DateTime SupplierOrderDate { get; set; }
        public string SupplierName { get; set; }
    }

    public class SupplierOrderNotificationVM
    {
        public string notification { get; set; }
    }

    public class CurrentOrder
    {
        public int SupplierOrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
    }
}

