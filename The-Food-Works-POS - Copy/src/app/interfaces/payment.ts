export interface IPaymentDialog {
  paymentType: string;
  amount: number;
}

export interface IPaymentData {
  saleID: number;
  paymentType: string;
  amount: number;
}
