using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class Delivery
    {
        public class ViewDeliveryVM
        {
            public int deliveryID { get; set; }
            public int saleID { get; set; }
            public string customerFullName { get; set; }
            public string customerTelephone { get; set; }
            public string customerSignature { get; set; }
        }

        public class PendingDeliveryVM
        {
            public string driver { get; set; }
            public List<dynamic> splitDeliveries { get; set; }
        }

        public class CompleteDeliveryVM
        {
            public int saleID { get; set; }
            public string signature { get; set; }
        }

        public class CompleteInfoVM
        {
            public int saleID { get; set; }
            public string customerFullName { get; set; }
            public string customerTelephone { get; set; }
        }
    }
}