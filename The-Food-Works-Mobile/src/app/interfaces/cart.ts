export interface Cart {
  branchID: number;
  customerID: number;
  productID: number;
  quantity: number;
}

export interface ICartItem {
  productID: number;
  branchID: number;
  productImage: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface ICartFilter {
  cartID: number;
  branchID: number;
  productID?: number;
}
