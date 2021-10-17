/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICompleteDelivery, IWayPoints } from '../interfaces/delivery';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  // Page commmunication variables
  waypointsLength: number;
  saleID: number;
  httpOptions: any;


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
  setWaypointLength(data: any) {
    this.waypointsLength = data;
  }

  setSaleID(data: any) {
    this.saleID = data;
  }

  setLogout() {
    this.waypointsLength = null;
    this.saleID = null;
  }

  // API endpoint calls
  getRoute() {
    return this.accessService.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      return this.http.post(environment.baseURI + 'Delivery/GetRoute', +userID, this.httpOptions);
    }));
  }

  getCompleteInfo() {
    return this.http.post(environment.baseURI + 'Delivery/GetCompleteInfo', this.saleID);
  }

  completeDelivery(sign: any) {
    const body: ICompleteDelivery = {
      saleID: this.saleID,
      signature: sign
    };
    return this.http.post(environment.baseURI + 'Delivery/CompleteDelivery', body);
  }

  returnDelivery() {
    return this.http.post(environment.baseURI + 'Delivery/ReturnDelivery', this.saleID);
  }
}
