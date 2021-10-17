
export interface Batch {
  productID: string;
  productName: string;
  qtyOrdered: string;
  qtyRequested: string;
  qtyOnHand: string;
  qtyStillNeeded: string;
  qtyToProduce: string;
  qtyOutstanding: string;
}

export interface CookingList {
  CookingListId?: number,
  CookingListDate?: Date,
}

export interface ProductsNeeded {

}

export interface BatchLine {
  BatchId?: number,
  ProductId?: number,
  CookingListID?: number,
  ProductBarcode?: string,
  Quantity?: number,
  BatchLines?: any,

  EmployeeID?: number,


}

export interface CookingListView{
  CookingListID?: number,
  CookingListDate?: Date,
  BatchLines?: any,
  Batched?: any,
}

