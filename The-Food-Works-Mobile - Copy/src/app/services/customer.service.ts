import { INewLoyalty } from './../interfaces/loyalty';
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IProduct } from '../interfaces/product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart, ICartFilter } from '../interfaces/cart';
import { ICheckoutData } from '../interfaces/checkout';
import { IOrder, IOrderFilter } from '../interfaces/orders';
import { IReviewData } from '../interfaces/review';
import { ICustomer } from '../interfaces/access';
import { AccessService } from './access.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // Page commmunication variaables
  branchID: number;
  productID: number;
  orderID: number;
  quantity: number;
  httpOptions: any;
  vatPercentage: any;

  constructor(private http: HttpClient, public accessService: AccessService) {
    this.accessService.token.subscribe(token => {
      this.httpOptions = {
        headers: new HttpHeaders({
          contentType: 'application/json',
          Authorization: `Bearer ${token}`
        })
      };
    });
  }

  // Page communication
  setBranchID(data: any) {
    this.branchID = data;
  }

  setProductID(data: any) {
    this.productID = data;
  }

  setOrderID(data: any) {
    this.orderID = data;
  }

  setQuantity(data: any) {
    this.quantity = data;
  }

  setVAT(data: any) {
    this.vatPercentage = data;
  }

  setLogout() {
    this.branchID = null;
    this.productID = null;
    this.orderID = null;
    this.quantity = null;
    this.vatPercentage = null;
  }

  // API endpoint calls
  getBranchData() {
    return this.http.get(environment.baseURI + 'CustomerOrder/GetBranchLocation');
  }

  getAllProducts() {
    return this.http.post(environment.baseURI + 'CustomerOrder/GetProducts', this.branchID);
  }

  getPackage() {
    return this.http.get(environment.baseURI + 'CustomerOrder/GetPackage/' + this.branchID);
  }

  getProduct() {
    return this.http.get(environment.baseURI + 'CustomerOrder/GetProduct/' + this.productID + '/' + this.branchID, this.httpOptions);
  }

  addToCart() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: Cart = {
        branchID: this.branchID,
        customerID: +userID,
        productID: this.productID,
        quantity: this.quantity,
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/AddToCart', body, this.httpOptions);
    }));
  }

  getAllCartItems() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: ICartFilter = {
        cartID: +userID,
        branchID: this.branchID
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/GetCart', body, this.httpOptions);
    }));
  }

  clearCart() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: ICartFilter = {
        cartID: +userID,
        branchID: this.branchID
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/ClearCart', body, this.httpOptions);
    }));
  }

  removeItem(removeID: any) {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: ICartFilter = {
        cartID: +userID,
        branchID: this.branchID,
        productID: removeID
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/RemoveItem', body, this.httpOptions);
    }));
  }

  getVAT(): any {
    return this.http.get(environment.baseURI + 'CustomerOrder/GetVAT');
  }

  doCheckout(data: any) {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: ICheckoutData = {
        token: data.token,
        amount: data.amount,
        customerID: +userID,
        completionMethod: data.completionMethod,
        paymentMethod: data.paymentMethod,
        branchID: this.branchID
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/Checkout', body, this.httpOptions);
    }));
  }

  getAllOrders() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: IOrderFilter = {
        customerID: +userID,
        orderDate: new Date().getFullYear()
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/GetOrders', body, this.httpOptions);
    }));
  }

  getOrder(){
    return this.http.get(environment.baseURI + 'CustomerOrder/GetOrder/' + this.orderID, this.httpOptions);
  }

  doReview(formData: any) {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: IReviewData = {
        ratingStars: formData.rating,
        ratingOverview: formData.feedback,
        customerID: +userID,
        productID: this.productID
      };
      return this.http.post(environment.baseURI + 'CustomerOrder/DoReview', body, this.httpOptions);
    }));
  }

  getCustomerToUpdate() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Customer/GetCustomerToUpdate/' + userID, this.httpOptions);
    }));
  }

  doUpdateCustomer(body: ICustomer) {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      body.CustomerID = +userID;
      return this.http.post(environment.baseURI + 'Customer/UpdateCustomer', body, this.httpOptions);
    }));
  }

  // Loyalty Methods
  addToLoyalty(newLoyalty: any) {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: INewLoyalty = {
        customerId: +userID,
        customerEmail: newLoyalty.email,
        customerDob: newLoyalty.dob
      };
      return this.http.post(environment.baseURI + 'Loyalty/AddLoyalty', body, this.httpOptions);
    }));
  }

  getLoyaltyCustomerInfo() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Loyalty/GetLoyaltyCustomerInfo/' + userID, this.httpOptions);
    }));
  }

  getProgressInformation() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Loyalty/GetProgressInformation/' + userID, this.httpOptions);
    }));
  }

  getVoucherInformation() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Loyalty/GetVoucherInformation/' + userID, this.httpOptions);
    }));
  }

  getCustomerInformation() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Loyalty/GetCustomerInformation/' + userID, this.httpOptions);
    }));
  }

  unsubscribeMember() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.post(environment.baseURI + 'Loyalty/UnsubscribeMember/' + userID, this.httpOptions);
    }));
  }

  getLoyaltyStatus() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Loyalty/GetLoyaltyStatus/' + userID, this.httpOptions);
    }));
  }

  getRedemptions(id: any) {
    return this.http.get(environment.baseURI + 'Loyalty/GetRedemptions/' + id, this.httpOptions);
  }

  getEligibleVouchers() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.get(environment.baseURI + 'Loyalty/GetEligibleVouchers/' + userID, this.httpOptions);
    }));
  }

  deactivateCustomer() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.post(environment.baseURI + 'Customer/DeactivateCustomer', +userID);
    }));
  }
}
