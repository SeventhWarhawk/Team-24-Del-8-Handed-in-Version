import { SaleData, SaleLine } from './../interfaces/sale';
import { ProductSale } from 'src/app/interfaces/sale';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../interfaces/sale';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  server = 'https://localhost:44325/';
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    withCredentials: true,
    observe: 'response' as 'body',
  };

  getAllEmployees(): Observable <Sale[]> {
    return this.http.get<Sale[]>(this.server + 'Sale/GetAllSales', this.httpOptions);
  }

  getProducts(branchID: number) {
    return this.http.get(environment.baseURI + 'Sale/GetProducts/' + branchID);
  }

  getVAT() {
    return this.http.get(environment.baseURI + 'Sale/GetVAT');
  }

  doSale(data: SaleData) {
    return this.http.post(environment.baseURI + 'Sale/DoSale', data);
  }

  emailReceipt(data: any) {
    return this.http.post(environment.baseURI + 'Sale/EmailReceipt', data);
  }

}
