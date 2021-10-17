export interface IOrderFilter {
  customerID: number;
  orderDate: number;
}

export interface IOrders {
  orderID: number;
  orderDate: Date;
  orderStatus: string;
  icon: string;
  color: string;
  orderLines: any;
}

export interface IOrder {
  orderID: number;
  orderSatus: number;
  completionMethod: string;
  paymentMethod: string;
  branch: string;
  orderLines: any;
}
