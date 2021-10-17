import { CustomerOrder, SalePaymentType } from './../interfaces/customerOrder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaleStatuses } from '../interfaces/saleStatus';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  getOrdersToPack() {
    return this.http.get(environment.baseURI + 'CustomerOrderAdmin/GetOrdersToPack', this.httpOptions);
  }

  getOrderItems(saleID: any) {
    return this.http.get(environment.baseURI + 'CustomerOrderAdmin/GetItemsToPack/' + saleID, this.httpOptions);
  }

  packOrder(saleID: any) {
    return this.http.post(environment.baseURI + 'CustomerOrderAdmin/PackOrder', saleID, this.httpOptions);
  }
}
