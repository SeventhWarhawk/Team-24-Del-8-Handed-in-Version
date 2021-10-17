
export interface Sale {
  SaleTotal?: number,
  saleTotal?: number,
  CustomerId?: number,
  SaleStatusId?: number,
  SaleTypeId?: number,
  CompletionMethodId?: number,
  EmployeeId?: number,
  BranchId?: number,
  branchId?: number;
  SaleLines: any,
  EmailAddress?: string,
  PaymentType: string,


}

export interface TodaySalesVM {
  saleType: string,
  paymentType: string,
  SaleTotal: number,
  completionMethod: string,
  customerName: string,
  employeeName: string,
}

export interface ProductSale {
  ProductBarcode?: string,
}

export interface SaleLine {
  quantity: number;
  productName?: string;
  productPriceAmount: number;
  productBarcode: string;
  ProductId: number,

}

export interface SaleOverview {
  productID: number;
  productName: string;
  productBarcode: string;
  productPrice: number;
  quantity: number;
}

export interface Product {
  productID: number;
  productName: string;
  productPrice: number;
  productBarcode: string;
}

export interface SaleData {
  emailAddress?: string;
  employeeID: number;
  branchID: number;
  saleTotal: number;
  vatTotal?: number;
  subtotal?: number;
  paymentType: string;
  customerID?: number;
  saleLines: SaleOverview[];
}

