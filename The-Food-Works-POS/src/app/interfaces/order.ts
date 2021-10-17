export interface IOrder {
  orderID: number;
  orderSatus: number;
  orderDate: any;
  completionMethod: string;
  paymentMethod: string;
  orderLines: any;
}

export interface IOrderLine {
  productID: number;
​  productName: string;
  productPrice: number;
  quantity: number;
}

export interface ICustomerDetails {
  customerName: string;
​  customerSurname: string;
  customerEmail: string;
}


