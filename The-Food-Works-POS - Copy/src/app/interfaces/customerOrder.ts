export interface SalePaymentType{
  SaleId?: number;
  PaymentTypeId? : number;
  PaymentTypeDescription? : string;
}

export interface CustomerOrder {
  SaleId: number;
  DateofSale?: string;
  CustomerName?: string;
  CustomerSurname?: string;
  CustomerTelephone?: string;
  SaleStatusDescription?: string;
  CompletionMethodDescription?: string;
  BranchName?: string;
  paymentTypes?: SalePaymentType[];
  saleStatusId? : number;
  ProductNames? :[];
  Quantities? :[]
}

export interface IOrdersToPack {
  saleID: number;
  dateOfSale: string;
  customerName: string;
  customerTelephone: string;
  saleStatus: string;
  completionMethod: string;
  branchName: string;
  paymentType: string;
}

export interface IOrderItems {
  saleID: number;
  barcode: string;
  productName: string;
  quantity: number;
  packed: boolean;
}


