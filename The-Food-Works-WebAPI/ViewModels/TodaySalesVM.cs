using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class TodaySalesVM
    {
        public string saleType { get; set; }
        public string paymentType { get; set; }
        public double SaleTotal { get; set; }
        public string completionMethod { get; set; }
        public string customerName { get; set; }
        public string employeeName { get; set; }
    }

    public class BranchSelectionVM
    {
        public int branchId { get; set; }
    }

    public class CategorySalesVM
    { 
        public int mainCount { get; set; }
        public int sideCount { get; set; }
        public int dessertCount { get; set; }
        public int packageCount { get; set; }

    }


}
