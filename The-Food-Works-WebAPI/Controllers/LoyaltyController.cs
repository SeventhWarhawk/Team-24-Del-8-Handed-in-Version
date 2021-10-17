using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;

using Vonage;
using Vonage.Request;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoyaltyController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        // Get Searched for customer(s) (using email or cellphone number)
        [HttpGet]
        [Route("GetCustomer/{criteria}")]
        public List<dynamic> GetSearchedCustomers([FromRoute] string criteria)
        {
            var customers = db.Customer.Where(x => x.CustomerTelephone == criteria || x.CustomerEmail == criteria).ToList();
            return GetSearchedCustomers(customers);
        }

        // Update Current Loyalty Percentage
        [HttpPost]
        [Route("UpdateLoyaltyPercentage/{newPercentage}")]
        public ActionResult UpdateLoyaltyPercentage([FromRoute] float newPercentage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var currentPercentage = db.LoyaltyPercentage.FirstOrDefault();
                currentPercentage.LoyaltyPercentageAmount = newPercentage;
                currentPercentage.LoyaltyPercentageDate = DateTime.Now;
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Get Current Loyalty Percentage
        [HttpGet]
        [Route("GetLoyaltyPercentage")]
        public object GetLoyaltyPercentage()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var currentPercentage = db.LoyaltyPercentage.Select(x => x.LoyaltyPercentageAmount).FirstOrDefault();
                return currentPercentage;
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        public List<dynamic> GetSearchedCustomers(List<Customer> customers)
        {
            var dynamicCustomers = new List<dynamic>();

            foreach (var customer in customers)
            {
                dynamic dynamicCustomer = new ExpandoObject();
                dynamicCustomer.customerId = customer.CustomerId;
                dynamicCustomer.customerName = customer.CustomerName;
                dynamicCustomer.customerSurname = customer.CustomerSurname;
                dynamicCustomer.customerDob = customer.CustomerDob;
                dynamicCustomer.customerTelephone = customer.CustomerTelephone;
                dynamicCustomer.customerEmail = customer.CustomerEmail;
                dynamicCustomer.isLoyaltyProgram = customer.IsLoyaltyProgram;
                dynamicCustomers.Add(dynamicCustomer);
            }
            return dynamicCustomers;
        }

        // Get Searched for voucher (using voucher code)
        [HttpGet]
        [Route("GetVoucher/{code}")]
        public object GetSearchedVoucher([FromRoute] string code)
        {
            var voucher = db.Voucher.Include(x => x.Customer).Where(x => x.VoucherCode == code).FirstOrDefault();
            return voucher;
        }

        // Get Customers Info (Mobile Join Loyalty)
        [HttpGet]
        [Route("GetLoyaltyCustomerInfo/{userId}")]
        public User GetLoyaltyCustomerInfo([FromRoute] int userId)
        {
            var user = db.User.Where(x => x.CustomerId == userId).FirstOrDefault();
            return user;
        }

        // Add New Loyalty Member
        [HttpPost]
        [Route("AddLoyalty")]
        public ActionResult AddLoyalty([FromBody] NewLoyaltyVM newLoyalty)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    var customerToAdd = db.Customer.Where(x => x.CustomerEmail == newLoyalty.customerEmail).FirstOrDefault();
                    customerToAdd.IsLoyaltyProgram = true;
                    customerToAdd.CustomerDob = newLoyalty.customerDob;
                    var newLoyaltyDate = new LoyaltyDate
                    {
                        DateJoined = DateTime.Now,
                        CustomerId = newLoyalty.customerId
                    };
                    db.LoyaltyDate.Add(newLoyaltyDate);
                    db.SaveChanges();

                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        [HttpPost]
        [Route("CaptureInstance")]
        public ActionResult CaptureInstance([FromBody] AppliedVoucherVM voucher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    var voucherToUpdate = db.Voucher.Where(x => x.VoucherId == voucher.id).FirstOrDefault();
                    var lastInstance = db.RedeemedInstance.Where(x => x.VoucherId == voucher.id).OrderByDescending(x => x.RedeemedInstanceId).FirstOrDefault();

                    // Update Voucher Amount After Redemption
                    voucherToUpdate.VoucherAmount = voucher.newAmount;

                    if (lastInstance == null)
                    {
                        var newInstance = new RedeemedInstance
                        {
                            RedeemedInstanceNumber = 1,
                            RedeemedInstanceAmount = voucher.instanceAmount,
                            RedeemedInstanceDate = DateTime.Now,
                            VoucherId = voucher.id,
                        };
                        db.RedeemedInstance.Add(newInstance);
                        db.SaveChanges();
                    }
                    else
                    {
                        var newInstance = new RedeemedInstance
                        {
                            RedeemedInstanceNumber = lastInstance.RedeemedInstanceNumber + 1,
                            RedeemedInstanceAmount = voucher.instanceAmount,
                            RedeemedInstanceDate = DateTime.Now,
                            VoucherId = voucher.id,
                        };
                        db.RedeemedInstance.Add(newInstance);
                        db.SaveChanges();
                    }

                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Get Loyalty Status (For Mobile)
        [HttpGet]
        [Route("GetLoyaltyStatus/{id}")]
        public bool ActionResult([FromRoute] int id)
        {
            var status = db.Customer.Where(x => x.CustomerId == id).Select(x => x.IsLoyaltyProgram).FirstOrDefault();
            return status;
        }

        // Check for expired vouchers and mark as inactive
        [HttpPost]
        [Route("MarkExpired")]
        public ActionResult MarkExpired()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                Console.WriteLine("Hello");
                var allVouchers = db.Voucher.ToList();
                var todaysDate = DateTime.Now;

                TimeSpan ts = new TimeSpan(00, 00, 00);
                todaysDate = todaysDate.Date + ts;
                foreach (var voucher in allVouchers)
                {
                    var vouchersDate = voucher.VoucherExpiryDate;
                    vouchersDate = vouchersDate.Date + ts;
                    if (vouchersDate == todaysDate)
                    {
                        voucher.VoucherStatus = false;
                        db.SaveChanges();
                    }
                }
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Generate new voucher(s)
        [HttpPost]
        [Route("GenerateVoucher")]
        public ActionResult GenerateVoucher()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    // Get Voucher Expiration Date
                    DateTime generationDate = DateTime.Today;
                    int generationDateMonth = generationDate.Month;
                    DateTime expirationDate = generationDate.AddMonths(1);
                    int expirationDateMonth = expirationDate.Month;
                    var eligibleCustomer = db.Customer.Where(x => x.IsLoyaltyProgram == true).Include(x => x.LoyaltyDate).Include(x => x.Voucher).ToList();

                    foreach (var customer in eligibleCustomer)
                    {
                        // Generate Final Voucher
                        var discount = db.LoyaltyPercentage.Select(x => x.LoyaltyPercentageAmount).FirstOrDefault();
                        double totalSales = 0;

                        // Generate New Voucher Code
                        string newCode = "";
                        int newCodeLength = 7;
                        StringBuilder str_build = new StringBuilder();
                        Random random = new Random();
                        char letter;

                        for (int i = 0; i < newCodeLength; i++)
                        {
                            double flt = random.NextDouble();
                            int shift = Convert.ToInt32(Math.Floor(25 * flt));
                            letter = Convert.ToChar(shift + 65);
                            str_build.Append(letter);
                        }

                        newCode = str_build.ToString();
                        var oldCode = db.Voucher.Where(x => x.VoucherCode == newCode).Select(x => x.VoucherCode).FirstOrDefault();

                        while (oldCode == newCode)
                        {
                            int newCodeLength1 = 7;
                            StringBuilder str_build1 = new StringBuilder();
                            Random random1 = new Random();
                            char letter1;
                            for (int i = 0; i < newCodeLength1; i++)
                            {
                                double flt1 = random1.NextDouble();
                                int shift1 = Convert.ToInt32(Math.Floor(25 * flt1));
                                letter1 = Convert.ToChar(shift1 + 65);
                                str_build1.Append(letter1);
                            }
                            newCode = str_build1.ToString();
                        }

                        if (customer.CustomerDob != null)
                        {
                            int? customerDateMonth = customer.CustomerDob.Value.Month;

                            if (generationDateMonth == customerDateMonth)
                            {
                                // Get Correct Sales Amount (Since Last Voucher or Since Date Joined)
                                var allloyaltySales = db.SalePaymentType.Include(x => x.Sale).Where(x => x.Sale.CustomerId == customer.CustomerId && (x.PaymentTypeId != 3 || x.PaymentTypeId != 5)).ToList();
                                var dateJoined = customer.LoyaltyDate.Select(x => x.DateJoined).FirstOrDefault();
                                var lastVoucherDate = customer.Voucher.Where(x => x.CustomerId == customer.CustomerId).OrderByDescending(x => x.VoucherId).Select(x => x.VoucherExpiryDate).FirstOrDefault();
                                DateTime defaultDateTime = new DateTime(0001, 1, 1, 00, 00, 00);
                                if (lastVoucherDate != defaultDateTime && lastVoucherDate > dateJoined)
                                {
                                    lastVoucherDate = lastVoucherDate.AddMonths(-1);
                                    var allLoyaltySalesVoucher = allloyaltySales.Where(x => x.Sale.DateOfSale > lastVoucherDate).ToList();
                                    foreach (var sale in allLoyaltySalesVoucher)
                                    {
                                        totalSales += sale.Sale.SaleTotal;
                                    }
                                }
                                else if (dateJoined != null)
                                {
                                    var allLoyaltySalesJoined = allloyaltySales.Where(x => x.Sale.DateOfSale >= dateJoined).ToList();
                                    foreach (var sale in allLoyaltySalesJoined)
                                    {
                                        totalSales += sale.Sale.SaleTotal;
                                    }
                                }

                                // Get Amount Carried Over From Last Voucher (If Any)
                                var lastVoucherId = customer.Voucher.Where(x => x.CustomerId == customer.CustomerId).OrderByDescending(x => x.VoucherId).Select(x => x.VoucherId).FirstOrDefault();

                                var lastVoucherAmount = customer.Voucher.Where(x => x.CustomerId == customer.CustomerId).OrderByDescending(x => x.VoucherId).Select(x => x.VoucherAmount).FirstOrDefault();

                                var totalRedeemedObject = db.RedeemedInstance.Include(x => x.Voucher).Where(x => x.Voucher.VoucherId == lastVoucherId).ToList();
                                double totalAmountRedeemed = 0.00;
                                double carriedForward = 0.00;

                                foreach (var amount in totalRedeemedObject)
                                {
                                    totalAmountRedeemed += amount.RedeemedInstanceAmount;
                                }

                                carriedForward = lastVoucherAmount - totalAmountRedeemed;

                                if (carriedForward >= 0)
                                {
                                    totalSales = totalSales * discount / 100;
                                    totalSales += carriedForward;
                                }
                                else if (carriedForward < 0)
                                {
                                    totalSales = totalSales * discount / 100;
                                }

                                if (totalSales > 0)
                                {
                                    var newVoucher = new Voucher
                                    {
                                        VoucherCode = newCode,
                                        VoucherStatus = true,
                                        VoucherExpiryDate = expirationDate,
                                        VoucherAmount = Math.Round(totalSales, 2),
                                        CustomerId = customer.CustomerId
                                    };
                                    db.Voucher.Add(newVoucher);
                                    db.SaveChanges();

                                    // Format Number
                                    string newNumber = customer.CustomerTelephone;
                                    newNumber = newNumber.Remove(0, 1);
                                    newNumber = "27" + newNumber;

                                    // Format Amount
                                    double finalVoucherAmount = totalSales;
                                    finalVoucherAmount.ToString("C", CultureInfo.CreateSpecificCulture("af-ZA"));
                                    String.Format("{0:0.00}", finalVoucherAmount);

                                    // Send Email
                                    string date = DateTime.Now.ToString();
                                    string formatDate = string.Format("{0:f}", date);
                                    string subject = "Loyalty voucher at The Food Works " + formatDate;
                                    string body;
                                    Assembly asm = Assembly.GetExecutingAssembly();
                                    string resourceName = asm.GetManifestResourceNames().Single(str => str.EndsWith("loyalty-template.html"));
                                    using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
                                    {
                                        TextReader tr = new StreamReader(stream);
                                        body = tr.ReadToEnd();
                                    }
                                    body = body.Replace("**titleHeading**", "Loyalty Reward").Replace("**subheading**", "Hello " + customer.CustomerName + ". You have a new voucher!").Replace("**bodyText**", "To reward you for your loyal patronage, and being a part of our loyalty program, you have been gifted a new voucher to be used during this month, which we have reason to believe is your birthday month! The voucher's amount is based off how much you have supported us throughout the past year. Please present the voucher code below to one of our friendly cashiers upon your next visit and we will apply the full amount to your transactions value. Please note, the voucher is only redeemable up until the end of this month. However, don't be alarmed, as any un-used amount is carried over to your next voucher!").Replace("**voucherCode**", newCode).Replace("**voucherAmount**", string.Format("{0:R#,##0.00;(R#,##0.00);Zero}", totalSales)).Replace("**voucherExpire**", expirationDate.ToString("dd/MM/yyyy"));
                                    new EmailSender().SendEmailAsync(customer.CustomerEmail, subject, body);

                                    //Send SMS
                                    var credentials = Credentials.FromApiKeyAndSecret(
                                        "019ee815",
                                        "mGEPSixJ2T0voEND"
                                    );

                                    var VonageClient = new VonageClient(credentials);

                                    var response = VonageClient.SmsClient.SendAnSms(new Vonage.Messaging.SendSmsRequest()
                                    {
                                        To = "27614474968",
                                        From = "Food Works",
                                        Text = "Hello from The Food Works!" + " Good Day " + customer.CustomerName + ". We believe that it's your birthday this month. So to give back for your loyal patronage, " +
                                        "you have been awarded a voucher to be used during this month, based off of how much you have supported us throughout the past year! Your voucher's value is: " + string.Format("{0:R#,##0.00;(R#,##0.00);Zero}", totalSales) + ". " +
                                        "Your voucher will expire on: " + expirationDate.ToString("dd/MM/yyyy") + ". In order to redeem your voucher, present the following code to the cashier upon arrival; VOUCHER CODE: " + newCode + ". You may also view your " +
                                        "voucher's code or QR code on The Food Works mobile app available for free on the Google Play Store."
                                    });
                                }
                            }
                        }
                    }
                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Get Customer Information For Particular Customer
        [HttpGet]
        [Route("GetCustomerInformation/{id}")]
        public List<dynamic> GetCustomerInformation([FromRoute] int id)
        {
            var customer = db.Customer.Include(x => x.LoyaltyDate).Where(x => x.CustomerId == id).ToList();
            return GetDynamicCustomerInformation(customer);
        }

        public List<dynamic> GetDynamicCustomerInformation(List<Customer> customer)
        {
            var dynamicCustomers = new List<dynamic>();

            foreach (var item in customer)
            {
                dynamic dynamicCustomer = new ExpandoObject();
                dynamicCustomer.registrationDate = item.LoyaltyDate.Select(x => x.DateJoined).FirstOrDefault();
                dynamicCustomer.contactNumber = item.CustomerTelephone;
                dynamicCustomer.contactEmail = item.CustomerEmail;
                dynamicCustomer.dateOfBirth = item.CustomerDob;
                dynamicCustomers.Add(dynamicCustomer);
            }
            return dynamicCustomers;
        }

        // Get Voucher Information For Particular Customer
        [HttpGet]
        [Route("GetVoucherInformation/{id}")]
        public List<dynamic> GetVoucherInformation([FromRoute] int id)
        {
            var vouchers = db.Voucher.Include(x => x.RedeemedInstance).Include(x => x.Customer).ThenInclude(x => x.LoyaltyDate).Where(x => x.CustomerId == id).ToList();
            return GetDynamicVoucherInformation(vouchers);
        }

        public List<dynamic> GetDynamicVoucherInformation(List<Voucher> vouchers)
        {
            var dynamicVouchers = new List<dynamic>();

            foreach (var voucher in vouchers)
            {
                dynamic dynamicVoucher = new ExpandoObject();
                dynamicVoucher.voucherId = voucher.VoucherId;
                dynamicVoucher.voucherCode = voucher.VoucherCode;
                dynamicVoucher.voucherStatus = voucher.VoucherStatus;
                dynamicVoucher.voucherGenerationDate = voucher.VoucherExpiryDate.AddMonths(-1);
                dynamicVoucher.voucherExpiryDate = voucher.VoucherExpiryDate;
                dynamicVoucher.voucherCurrentAmount = voucher.VoucherAmount;
                dynamicVoucher.registrationDate = voucher.Customer.LoyaltyDate.Select(x => x.DateJoined).FirstOrDefault();
                dynamicVoucher.contactNumber = voucher.Customer.CustomerTelephone;
                dynamicVoucher.contactEmail = voucher.Customer.CustomerEmail;
                dynamicVoucher.dateOfBirth = voucher.Customer.CustomerDob;

                // Get Redeemed Instances Information
                var instances = db.RedeemedInstance.Where(x => x.VoucherId == voucher.VoucherId).ToList();
                if (instances.Count != 0)
                {
                    double totalRedeemed = 0;
                    foreach (var instance in instances)
                    {
                        totalRedeemed += instance.RedeemedInstanceAmount;
                    }
                    var lastInstance = db.RedeemedInstance.Where(x => x.VoucherId == voucher.VoucherId).OrderByDescending(x => x.RedeemedInstanceId).FirstOrDefault();

                    dynamicVoucher.lastRedemptionDate = lastInstance.RedeemedInstanceDate;
                    dynamicVoucher.voucherTotalAmount = voucher.VoucherAmount + totalRedeemed;
                    dynamicVoucher.voucherRedeemedAmount = totalRedeemed;
                    dynamicVoucher.voucherCarriedAmount = voucher.VoucherAmount;
                    dynamicVoucher.timesRedeemed = lastInstance.RedeemedInstanceNumber;
                }
                else
                {
                    dynamicVoucher.lastRedemptionDate = false;
                    dynamicVoucher.voucherTotalAmount = voucher.VoucherAmount;
                    dynamicVoucher.voucherRedeemedAmount = 0;
                    dynamicVoucher.voucherCarriedAmount = voucher.VoucherAmount;
                    dynamicVoucher.timesRedeemed = 0;
                }
                dynamicVouchers.Add(dynamicVoucher);
            }
            return dynamicVouchers;
        }

        // Get All Previous Redemptions

        [HttpGet]
        [Route("GetRedemptions/{id}")]
        public List<dynamic> GetRedemptions([FromRoute] int id)
        {
            var redemptions = db.RedeemedInstance.Where(x => x.VoucherId == id).ToList();
            return GetDynamicRedemptions(redemptions);
        }

        public List<dynamic> GetDynamicRedemptions(List<RedeemedInstance> redemptions)
        {
            var dynamicRedemptions = new List<dynamic>();

            foreach (var item in redemptions)
            {
                dynamic dynamicRedemption = new ExpandoObject();
                dynamicRedemption.redeemedInstanceId = item.RedeemedInstanceId;
                dynamicRedemption.redeemedInstanceNumber = item.RedeemedInstanceNumber;
                dynamicRedemption.redeemedInstanceAmount = item.RedeemedInstanceAmount;
                dynamicRedemption.redeemedInstanceDate = item.RedeemedInstanceDate;
                dynamicRedemption.voucherId = item.VoucherId;
                dynamicRedemptions.Add(dynamicRedemption);
            }
            return dynamicRedemptions;
        }

        // Get Progress Information

        [HttpGet]
        [Route("GetProgressInformation/{id}")]
        public List<dynamic> GetProgressInformation([FromRoute] int id)
        {
            var dynamicProgressInfo = new List<dynamic>();
            dynamic dynamicProgress = new ExpandoObject();

            var lastVoucher = db.Voucher.Where(x => x.CustomerId == id).OrderByDescending(x => x.VoucherId).FirstOrDefault();
            var customer = db.Customer.Include(x => x.LoyaltyDate).Where(x => x.CustomerId == id).FirstOrDefault();

            if (lastVoucher == null)
            {
                dynamicProgress.prevVoucherDate = customer.LoyaltyDate.Select(x => x.DateJoined).FirstOrDefault();
                var originalDateTime = customer.CustomerDob;
                var currentDate = DateTime.Now;
                DateTime newDateTime = new DateTime(currentDate.Year, originalDateTime.Value.Month, originalDateTime.Value.Day);

                if (newDateTime >= currentDate)
                {
                    dynamicProgress.nextVoucherDate = newDateTime;
                }
                else if (newDateTime <= currentDate)
                {
                    dynamicProgress.nextVoucherDate = newDateTime.AddYears(1);
                }
            }
            else
            {
                // Previous Voucher Date
                dynamicProgress.prevVoucherDate = lastVoucher.VoucherExpiryDate.AddMonths(-1);
                var lastGenerationDate = lastVoucher.VoucherExpiryDate.AddMonths(-1);

                // Next Voucher Date
                var nextDate = lastGenerationDate.AddYears(1);
                var nextDateBeginning = new DateTime(nextDate.Year, nextDate.Month, 1);
                dynamicProgress.nextVoucherDate = nextDateBeginning;
            }

            // Total Loyal Value of All Sales
            var discount = db.LoyaltyPercentage.Select(x => x.LoyaltyPercentageAmount).FirstOrDefault();
            var dateJoined1 = db.LoyaltyDate.Where(x => x.CustomerId == id).Select(x => x.DateJoined).FirstOrDefault();
            var sales = db.Sale.Where(x => x.CustomerId == id).Where(x => x.DateOfSale >= dateJoined1).ToList();
            double totalSales1 = 0.00;
            foreach (var item in sales)
            {
                totalSales1 += item.SaleTotal;
            }
            dynamicProgress.totalLoyaltySales = totalSales1 * discount / 100;
            dynamicProgress.totalNormalSales1 = totalSales1;

            // Get Correct Sales Amount (Since Last Voucher or Since Date Joined)
            double totalLoyaltySales = 0;
            double totalNormalSales = 0;
            var allloyaltySales = db.Sale.Where(x => x.CustomerId == customer.CustomerId).ToList();
            var dateJoined = customer.LoyaltyDate.Select(x => x.DateJoined).FirstOrDefault();
            var lastVoucherDate = customer.Voucher.Where(x => x.CustomerId == customer.CustomerId).OrderByDescending(x => x.VoucherId).Select(x => x.VoucherExpiryDate).FirstOrDefault();
            DateTime defaultDateTime = new DateTime(0001, 1, 1, 00, 00, 00);
            if (lastVoucherDate != defaultDateTime && lastVoucherDate > dateJoined)
            {
                lastVoucherDate = lastVoucherDate.AddMonths(-1);
                var allLoyaltySalesVoucher = allloyaltySales.Where(x => x.DateOfSale > lastVoucherDate).ToList();
                foreach (var sale in allLoyaltySalesVoucher)
                {
                    totalLoyaltySales += sale.SaleTotal;
                    totalNormalSales += sale.SaleTotal;
                }
            }
            else if (dateJoined != null)
            {
                var allLoyaltySalesJoined = allloyaltySales.Where(x => x.DateOfSale >= dateJoined).ToList();
                foreach (var sale in allLoyaltySalesJoined)
                {
                    totalLoyaltySales += sale.SaleTotal;
                    totalNormalSales += sale.SaleTotal;
                }
            }

            // Get Amount Carried Over From Last Voucher (If Any)
            var lastVoucherId = customer.Voucher.Where(x => x.CustomerId == customer.CustomerId).OrderByDescending(x => x.VoucherId).Select(x => x.VoucherId).FirstOrDefault();
            var lastVoucherAmount = customer.Voucher.Where(x => x.CustomerId == customer.CustomerId).OrderByDescending(x => x.VoucherId).Select(x => x.VoucherAmount).FirstOrDefault();
            var totalRedeemedObject = db.RedeemedInstance.Include(x => x.Voucher).Where(x => x.Voucher.VoucherId == lastVoucherId).ToList();
            double totalAmountRedeemed = 0.00;
            double carriedForward = 0.00;

            foreach (var amount in totalRedeemedObject)
            {
                totalAmountRedeemed += amount.RedeemedInstanceAmount;
            }

            carriedForward = lastVoucherAmount - totalAmountRedeemed;

            if (carriedForward >= 0)
            {
                totalLoyaltySales = totalLoyaltySales * discount / 100;
                totalLoyaltySales += carriedForward;

                totalNormalSales += carriedForward;
            }
            else if (carriedForward < 0)
            {
                totalLoyaltySales = totalLoyaltySales * discount / 100;

                totalNormalSales = totalLoyaltySales;
            }

            dynamicProgress.nextVoucherLoyalty = Math.Round(totalLoyaltySales, 2);
            dynamicProgress.nextVoucherSales = Math.Round(totalNormalSales, 2);
            dynamicProgressInfo.Add(dynamicProgress);
            return dynamicProgressInfo;
        }

        // Unsubscribe Loyalty Member

        [HttpPost]
        [Route("UnsubscribeMember/{id}")]
        public ActionResult UnsubscribeMember([FromRoute] int id)
        {
            var toUnsubscribe = db.Customer.Where(x => x.CustomerId == id).FirstOrDefault();
            var dateToUnsubscribe = db.LoyaltyDate.Where(x => x.CustomerId == id).FirstOrDefault();
            toUnsubscribe.IsLoyaltyProgram = false;
            db.LoyaltyDate.Remove(dateToUnsubscribe);
            db.SaveChanges();
            return Ok();
        }

        // Get Voucher Information For Particular Customer
        [HttpGet]
        [Route("GetLoyaltyCustomers")]
        public List<dynamic> GetLoyaltyCustomers([FromRoute] int id)
        {
            var customers = db.Customer.Include(x => x.LoyaltyDate).Where(x => x.IsLoyaltyProgram == true).ToList();
            return GetDynamicLoyaltyCustomers(customers);
        }

        public List<dynamic> GetDynamicLoyaltyCustomers(List<Customer> customers)
        {
            var dynamicCustomers = new List<dynamic>();

            foreach (var customer in customers)
            {
                dynamic dynamicCustomer = new ExpandoObject();
                dynamicCustomer.customerId = customer.CustomerId;
                dynamicCustomer.customerName = customer.CustomerName;
                dynamicCustomer.customerSurname = customer.CustomerSurname;
                dynamicCustomer.customerDob = customer.CustomerDob;
                dynamicCustomer.customerTelephone = customer.CustomerTelephone;
                dynamicCustomer.customerEmail = customer.CustomerEmail;
                dynamicCustomer.dateJoined = customer.LoyaltyDate.Select(x => x.DateJoined).FirstOrDefault();
                dynamicCustomers.Add(dynamicCustomer);
            }
            return dynamicCustomers;
        }

        // Check if User Exists
        private bool UserExists(string EmailAddress, string TelephoneNumber)
        {
            var user = db.Customer.Where(zz => zz.CustomerEmail == EmailAddress || zz.CustomerTelephone == TelephoneNumber).FirstOrDefault();
            if (user != null)
            {
                return true;
            }
            return false;
        }

        // Add Loyalty Customer (Does NOT create a user)
        [HttpPost]
        [Route("AddLoyaltyMember")]
        public ActionResult AddLoyaltyMember([FromBody] LoyaltyMemberVM newMember)
        {
            if (UserExists(newMember.Details.customerEmail, newMember.Details.customerTelephone))
            {
                return Forbid();
            }
            try
            {
                using (var transSQL = db.Database.BeginTransaction())
                {
                    var customer = new Customer
                    {
                        CustomerName = newMember.Details.customerName,
                        CustomerSurname = newMember.Details.customerSurname,
                        CustomerDob = newMember.Details.customerDob,
                        CustomerTelephone = newMember.Details.customerTelephone,
                        CustomerEmail = newMember.Details.customerEmail,
                        IsLoyaltyProgram = true
                    };

                    db.Customer.Add(customer);
                    db.SaveChanges();

                    var customerAddress = new CustomerAddress
                    {
                        CustomerId = customer.CustomerId,
                        AddressStreetNum = newMember.Address.customerStreetNumberSeperate,
                        AddressStreetName = newMember.Address.customerStreetNameSeperate,
                        AddressCity = newMember.Address.customerCity,
                        AddressPostalCode = newMember.Address.customerZip,
                        AddressProvince = newMember.Address.customerProvince,
                        AddressDate = DateTime.Now,
                        AddressLat = newMember.Address.customerLat,
                        AddressLng = newMember.Address.customerLng
                    };

                    db.CustomerAddress.Add(customerAddress);
                    db.SaveChanges();

                    var newLoyaltyDate = new LoyaltyDate
                    {
                        DateJoined = DateTime.Now,
                        CustomerId = customer.CustomerId
                    };

                    db.LoyaltyDate.Add(newLoyaltyDate);
                    db.SaveChanges();

                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        [HttpGet]
        [Route("GetEligibleVouchers/{id}")]
        public List<Voucher> GetEligibleVouchers([FromRoute] int id)
        {
            var vouchers = db.Voucher.Where(x => x.CustomerId == id && x.VoucherAmount > 0).ToList();
            return vouchers;
        }
    }
}