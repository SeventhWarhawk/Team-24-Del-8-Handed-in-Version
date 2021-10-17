import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ISplit } from '../interfaces/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  getPendingDeliveries() {
    return this.http.get(environment.baseURI + 'Delivery/GetPendingDeliveries');
  }

  getDrivers() {
    return this.http.get(environment.baseURI + 'Delivery/GetDrivers');
  }

  generatePendingDeliveries(body: ISplit[]) {
    return this.http.post(environment.baseURI + 'Delivery/GeneratePendingDeliveries', body);
  }

  getAllDeliveries() {
    return this.http.get(environment.baseURI + 'Delivery/GetDeliveries');
  }

  getViewDelivery(deliveryID: any) {
    return this.http.get(environment.baseURI + 'Delivery/GetViewDelivery/' + deliveryID);
  }
}
