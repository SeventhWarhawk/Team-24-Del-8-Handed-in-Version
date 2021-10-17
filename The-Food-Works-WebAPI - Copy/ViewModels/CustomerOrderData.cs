using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class CustomerOrderData
    {
        public class CustomerOrderVM
        {
            public int SaleId { get; set; }
            public DateTime DateofSale { get; set; }
            public int SaleStatusId {get;set;}
            public string CompletionMethodDescription { get; set; }
            public string CustomerName { get; set; }
            public string CustomerSurname { get; set; }
            public string CustomerTelephone { get; set; }
            public string BranchName { get; set; }
           // public bool IsPaid { get; set; }
            public List<SPT> salePaymentTypes { get; set; }
            public List<string> ProductNames { get; set; }
            public List<int> Quantities { get; set; }

        }

        public class SPT
        {
            public int SaleId { get; set; }
            public int PaymentId { get; set; }
            public string PaymentTypeDescription { get; set; }
        }

        public class SaleLineVM
        {
            public List<string> ProductNames { get; set; }
            public int SaleId { get; set; }
            public List<int> Quantities { get; set; }
            public DateTime DateofSale { get; set; }
            public int SaleStatusId { get; set; }
        }
    }
}
