export interface Supplier {
  SupplierId? : number;
  SupplierName : string;
  SupplierVatNumber? : string;
  SupplierContactNumber? : string;
  SupplierEmailAddress? : string;
  orderDays? : OrderDay[];
  SupplierOrderDayId? : number;
  SupplierOrderDayDescription? : string;
  OrderMethodName? : string;
  SupplierAddressBuildingNumber? : string;
  SupplierAddressStreetName? : string;
  SupplierAddressCity? : string;
  SupplierAddressId? : number;
  SupplierTypeId? : number;
  SupplierTypeName? : string;
  OrderMethodId?: number;
  SupplierStatusId?:number;
  SupplierStatusName?: string;
  days?:string[];
}
export interface OrderDay {
  SupplierOrderDayId? : number;
  SupplierOrderDayDescription : string;
  checked?:boolean;
}

export interface SupplierAddress {
  SupplierAddressId?: number;
  SupplierAddressFull?: string;
  SupplierAddressBuildingNumber?: string;
  SupplierAddressStreetName?: string;
  SupplierAddressCity?: string;
  SupplierAddressSuburb?: string;
  SupplierAddressProvince?: string;
  SupplierAddressCountry?: string;
  SupplierAddressDate?: Date;
  SupplierAddressZip?: string;
  SupplierAddressLat?: number;
  SupplierAddressLng?: number;
}

export interface SupplierCombined {
  supplier: Supplier,
  address?: SupplierAddress
}

export interface SupplierTypes {
  SupplierTypeId?: number;
  SupplierTypeName: string;
}

export interface SupplierStatus {
  SupplierStatusId: number;
  SupplierStatusName: string;
}
export interface OrderMethods {
  OrderMethodId: number;
  OrderMethodName: string;
}

export interface SuppAdd {
  SupplierId? : number;
  SupplierName : string;
  SupplierVatNumber? : string;
  SupplierContactNumber? : string;
  SupplierEmailAddress? : string;
  orderDays? : OrderDay[];
  SupplierOrderDayId? : number;
  SupplierOrderDayDescription? : string;
  OrderMethodName? : string;
  SupplierTypeId? : number;
  OrderMethodId?: number;
  SupplierStatusId?:number;

  SupplierAddressId?: number;
  SupplierAddressFull?: string;
  SupplierAddressBuildingNumber?: string;
  SupplierAddressStreetName?: string;
  SupplierAddressCity?: string;
  SupplierAddressSuburb?: string;
  SupplierAddressProvince?: string;
  SupplierAddressCountry?: string;
  SupplierAddressDate?: Date;
  SupplierAddressZip?: string;
  SupplierAddressLat?: number;
  SupplierAddressLng?: number;

}
