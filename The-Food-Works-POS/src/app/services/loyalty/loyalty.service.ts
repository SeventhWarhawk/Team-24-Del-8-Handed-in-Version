import { LoyaltyCustomer, NewLoyalty, Voucher, ViewedVoucher, combinedLoyaltyCustomer } from './../../interfaces/loyalty';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoyaltyService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    withCredentials: true,
    // observe: 'response' as 'body',
  };

  getSearchedCustomers(criteria: any) {
    return this.http.get<LoyaltyCustomer[]>(environment.baseURI + 'Loyalty/GetCustomer/' + criteria, this.httpOptions)
  }

  addToLoyalty(newLoyalty: any) {
    const body: NewLoyalty = {
      customerId: newLoyalty.id,
      customerEmail: newLoyalty.email,
      customerDob: newLoyalty.dob
    }
    return this.http.post(environment.baseURI + 'Loyalty/AddLoyalty', body, this.httpOptions)
  }

  generateVouchers() {
    return this.http.post(environment.baseURI + 'Loyalty/GenerateVoucher', this.httpOptions)
  }

  getSearchedVoucher(code: any) {
    return this.http.get<Voucher>(environment.baseURI + 'Loyalty/GetVoucher/' + code, this.httpOptions)
  }

  captureInstance(voucher: any) {
    console.log(voucher)
    return this.http.post(environment.baseURI + 'Loyalty/CaptureInstance', voucher, this.httpOptions)
  }

  getVoucherInformation(id: any) {
    return this.http.get(environment.baseURI + 'Loyalty/GetVoucherInformation/' + id, this.httpOptions)
  }

  getProgressInformation(id: any) {
    return this.http.get(environment.baseURI + 'Loyalty/GetProgressInformation/' + id, this.httpOptions)
  }

  getCustomerInformation(id: any) {
    return this.http.get(environment.baseURI + 'Loyalty/GetCustomerInformation/' + id, this.httpOptions)
  }

  getLoyaltyCustomers() {
    return this.http.get(environment.baseURI + 'Loyalty/GetLoyaltyCustomers', this.httpOptions)
  }

  getRedemptions(id: any) {
    return this.http.get(environment.baseURI + 'Loyalty/GetRedemptions/' + id, this.httpOptions)
  }

  unsubscribeMember(id: any) {
    return this.http.post(environment.baseURI + 'Loyalty/UnsubscribeMember/' + id, this.httpOptions)
  }

  getLoyaltyPercentage() {
    return this.http.get(environment.baseURI + 'Loyalty/GetLoyaltyPercentage', this.httpOptions)
  }

  updateLoyaltyPercentage(newPercentage: any) {
    return this.http.post(environment.baseURI + 'Loyalty/UpdateLoyaltyPercentage/' + newPercentage, this.httpOptions)
  }

  markExpired() {
    return this.http.post(environment.baseURI + 'Loyalty/MarkExpired', this.httpOptions)
  }

  addLoyaltyCustomer(customer: combinedLoyaltyCustomer): Observable<combinedLoyaltyCustomer> {
    return this.http.post<combinedLoyaltyCustomer>(environment.baseURI + 'Loyalty/AddLoyaltyMember', customer, this.httpOptions)
  }

  getAllCustomers() {
    return this.http.get(environment.baseURI + 'Customer/GetAllCustomers', this.httpOptions);
  }
}


