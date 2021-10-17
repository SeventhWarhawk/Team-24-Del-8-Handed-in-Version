import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICustomerDetails, IOrder } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  vatPercentage: number;

  constructor(private http: HttpClient) { }

  getVAT(): any {
    this.http.get(environment.baseURI + 'CustomerOrder/GetVAT').subscribe((res: any) => {
      this.vatPercentage = res;
    });
  }

  getOrder(orderID: any): Observable<IOrder> {
    return this.http.get<IOrder>(environment.baseURI + 'CustomerOrderAdmin/GetOrder/' + orderID).pipe();
  }

  getCustomerDetails(customerID: any): Observable<ICustomerDetails> {
    return this.http.get<ICustomerDetails>(environment.baseURI + 'CustomerOrderAdmin/GetCustomerDetails/' + customerID).pipe();
  }

  makePayment(data: any) {
    const body = {
      saleID: data.saleID,
      paymentType: data.paymentType,
      amount: data.amount
    };
    return this.http.post(environment.baseURI + 'CustomerOrderAdmin/MakePayment', body);
  }

  completeOrder(orderID: any) {
    return this.http.post(environment.baseURI + 'CustomerOrderAdmin/CompleteOrder', orderID);
  }
}
