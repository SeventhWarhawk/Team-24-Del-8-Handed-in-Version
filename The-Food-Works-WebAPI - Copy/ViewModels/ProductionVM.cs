using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class ProductionVM

    {
        public int? BatchId { get; set; }
        public int CookingListId { get; set; }
        public DateTime CookingListDate { get; set; }
        public int ProductId { get; set; }
        public string ProductBarcode { get; set; }
        public string ProductName { get; set; }
        public double? QuantityOnHand { get; set; }

        public int? QuantityOrdered { get; set; }

        public BatchLine[]batchLines { get; set; }

        public List<BatchLine> lineList { get; set; }
        public int? QuantityRequested { get; set; }

        public int? EmployeeId { get; set; }

        public int? Quantity { get; set; }
    }
}
