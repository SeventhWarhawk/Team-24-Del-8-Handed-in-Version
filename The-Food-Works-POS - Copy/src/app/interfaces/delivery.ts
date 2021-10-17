export interface IDelivery{
  deliveryID: number;
  address: string;
  postalCode: string;
}

export interface IDeliverySplit {
  address: any;
}

export interface ISplit {
  driver: any;
  splitDeliveries: IDeliverySplit[];
}

export interface IViewDelivery{
  deliveryID: number;
  saleID: number;
  customerFullName: string;
  address: string;
}
