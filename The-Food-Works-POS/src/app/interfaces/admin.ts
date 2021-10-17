export interface UserRole {
  id?: number;
  name: string;
  description: string;
}

export interface BranchProduct {
  Name: string;
  ID: number;
  Products: Product[];
}

export interface SelectedProduct {
  BranchId: number;
  SelectedId: number;
}
export interface Product {
  productId: number;
  name: string;
  description: string;
  QOH: number;
  isSelected: boolean;
}

export interface WriteOff {
  productId: number;
  branchId: number;
  WOReason: string;
  WOQuantity: number;
}

export interface BusinessRule {
  vat: number;
}

