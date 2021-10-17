
export interface LoyaltyCustomer {
  customerId: number;
  customerName: string;
  customerSurname: string;
  customerDob: Date;
  customerTelephone: string;
  customerEmail: string;
  isLoyaltyProgram: boolean;
}

export interface NewLoyalty {
  customerId: number;
  customerEmail: string;
  customerDob: string;
}

export interface Voucher {
  customerId: number;
  voucherAmount: number;
  voucherCode: string;
  voucherExpiryDate: any;
  voucherId: number;
  voucherStatus: boolean;
  customer: LoyaltyCustomer;
}

export interface LoyaltyCustomer {
  customerName: string;
  customerSurname: string;
}

export interface AppliedVoucher {
  redeemedInstanceAmount: any;
  voucherId: number;
  afterAppliedAmount: any;
}

export interface ViewedVoucher {
  voucherId: any;
  voucherCode: any;
  voucherStatus: any;
  voucherGenerationDate: any;
  voucherExpiryDate: any;
  voucherCurrentAmount: any;
  voucherCarriedAmount: any;
  lastRedemptionDate: any;
  voucherTotalAmount: any;
  voucherRedeemedAmount: any;
  timesRedeemed: any;
}

export interface loyaltyDialogData {
  voucherCode: any;
  redeemedInstanceId: any;
  redeemedInstanceNumber: any;
  redeemedInstanceAmount: any;
  redeemedInstanceDate: any;
  nextVoucherDate: any;
  nextVoucherLoyalty: any;
  nextVoucherSales: any;
  prevVoucherDate: any;
  totalLoyaltySales: any;
  totalNormalSales1: any;
  LoyaltyPercentageAmount: any;
}

export interface loyaltyCustomer {
  CustomerId: number;
  CustomerName: string;
  CustomerSurname: string;
  CustomerDob: any;
  CustomerTelephone: string;
  CustomerEmail: string;
  IsLoyaltyCustomer: boolean;
}

export interface loyaltyCustomerAddress {
  customerStreetNameSeperate: string;
  customerStreetNumberSeperate: string;
  CustomerStreetNumber: string;
  CustomerStreetName: string;
  CustomerSuburb: string;
  CustomerCity: string;
  CustomerProvince: string;
  CustomerCountry: string;
  CustomerZip: string;
  CustomerLat: number;
  CustomerLng: number;
}

export interface combinedLoyaltyCustomer {
  details: loyaltyCustomer;
  address: loyaltyCustomerAddress;
}
