using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class CustomerOrder
    {
        public class ProductVM
        {
            public int productID { get; set; }
            public string productImage { get; set; }
            public string productName { get; set; }
            public string productDescription { get; set; }
            public double productRating { get; set; }
            public double productPrice { get; set; }
        }

        public class CartVM
        {
            public int branchID { get; set; }
            public int customerID { get; set; }
            public int productID { get; set; }
            public int quantity { get; set; }
        }

        public class CheckoutVM
        {
            public string token { get; set; }
            public int amount { get; set; }
            public int customerID { get; set; }
            public int completionMethod { get; set; }
            public int paymentMethod { get; set; }
            public int branchID { get; set; }
        }

        public class OrderFilterVM
        {
            public int customerID { get; set; }
            public int orderDate { get; set; }
        }

        public class OrderVM
        {
            public int orderID { get; set; }
            public DateTime orderDate { get; set; }
            public int orderStatus { get; set; }
            public string completionMethod { get; set; }
            public string paymentMethod { get; set; }
            public string branch { get; set; }
            public List<dynamic> orderLines { get; set; }
        }

        public class ReviewVM
        {
            public int ratingStars { get; set; }
            public string ratingOverview { get; set; }
            public int customerID { get; set; }
            public int productID { get; set; }
        }

        public class CartFilterVM
        {
            public int cartID { get; set; }
            public int branchID { get; set; }
        }

        public class CartLineVM
        {
            public int cartID { get; set; }
            public int productID { get; set; }
            public int branchID { get; set; }
        }

        public class CustomerVM
        {
            public string customerName { get; set; }
            public string customerSurname { get; set; }
            public string customerTelephone { get; set; }
            public string customerEmail { get; set; }
        }

        public class PaymentVM
        {
            public int saleID { get; set; }
            public string paymentType { get; set; }
            public double amount { get; set; }
        }

        public class EmailVM
        {
            public string emailAddress { get; set; }
            public int branchID { get; set; }
            public float saleTotal { get; set; }
            public float vatTotal { get; set; }
            public string paymentType { get; set; }
            public List<dynamic> saleLines { get; set; }
        }
    }
}