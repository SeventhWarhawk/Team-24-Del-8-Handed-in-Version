export interface Product {
  ProductId?: number;
  ProductName: string;
  ProductDescription: string;
  ProductImage?: string;
  ProductTypeId: number;
  ProductTypeName?: string;
  ProductStatusId?: number;
  ProductStatusName?: string;
  ProductBarcode?: string;
  contents?: Content[];//or LIST?
  ProductContentId?: number;
  Quantity?: number
  ProductNames?: [];
  Quantities?: []
}

export interface Content {
  ProductId: number;
  ProductName?: string;
  Quantity: number
}

export interface Current {
  productId?: number;
  productContentId?: number;
  productName?: string;
  quantity?: number
}

export interface ProductTypes {
  ProductTypeId?: number;
  ProductTypeName: string;
}

export interface ProductStatuses {
  ProductStatusId: number;
  ProductStatusName: string;
}
