using System;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class NewLoyaltyVM
    {
        public string customerEmail { get; set; }
        public int customerId { get; set; }
        public DateTime customerDob { get; set; }
    }

    public class AppliedVoucherVM
    {
        public int id { get; set; } // Voucher ID
        public string code { get; set; } // Voucher Code
        public float amount { get; set; } // Original Voucher Amount
        public float newAmount { get; set; } // New Voucher Amount
        public float instanceAmount { get; set; } // Amount Redeemed in Current Transaction
    }

    public class LoyaltyMemberDetailsVM
    {
        public string customerName { get; set; }
        public string customerSurname { get; set; }
        public DateTime customerDob { get; set; }
        public string customerTelephone { get; set; }
        public string customerEmail { get; set; }
        public bool IsLoyaltyProgram { get; set; }
    }

    public class LoyaltyMemberAddressVM
    {
        public string customerAddressFull { get; set; }
        public string customerStreetNameSeperate { get; set; }
        public string customerStreetNumberSeperate { get; set; }
        public string customerStreetName { get; set; }
        public string customerSuburb { get; set; }
        public string customerCity { get; set; }
        public string customerProvince { get; set; }
        public string customerCountry { get; set; }
        public string customerZip { get; set; }
        public string customerDate { get; set; }
        public float customerLat { get; set; }
        public float customerLng { get; set; }
        public int customerId { get; set; }
    }

    public class LoyaltyMemberVM
    {
        public LoyaltyMemberDetailsVM Details { get; set; }
        public LoyaltyMemberAddressVM Address { get; set; }
    }
}