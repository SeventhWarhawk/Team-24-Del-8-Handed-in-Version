export interface ICheckoutData {
  token: string;
  amount: number;
  customerID: number;
  completionMethod: number;
  paymentMethod: number;
  branchID: number;
}
