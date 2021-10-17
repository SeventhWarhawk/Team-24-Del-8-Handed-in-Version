import { ResetPassword, ForgotPassword, ResetForgottenPassword } from './../interfaces/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../interfaces/customer';
import { User, OTP, UserInfo } from '../interfaces/user';
import { Branch } from '../interfaces/report';

export interface Notification {
  notification: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  OTPEmail: string;

  private _userInfo: UserInfo;

  link: string;

  OTPobj: OTP = {

    OTP: 1234,

    user: 'dummy@gmail.com'

  };

  ResetObj: ResetPassword;

  server = 'https://localhost:44325/';



  httpOptions = {

    headers: new HttpHeaders({

      ContentType: 'application/json'

    }),

    // withCredentials: true,

    // observe: 'response' as 'body',





  };



  constructor(private http: HttpClient) {





  }



  set userInfo(val: UserInfo) {

    const serializedState = JSON.stringify(val);

    localStorage.setItem("userInfo", serializedState);

    this._userInfo = val;

  }



  get userInfo() {

    const serializedState = localStorage.getItem("userInfo");

    if (serializedState != null) {

      this._userInfo = JSON.parse(serializedState);

    }

    return this._userInfo;



  }
  Register(user: Customer) {
    return this.http.post<Customer>(`${this.server}Customer/RegisterCustomer`, user, this.httpOptions);
  }

  Login(user: User): Observable<UserInfo> {
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo')!);
    // if (this.userInfo == null) {
    return this.http.post(`${this.server}User/Login`, user, { observe: 'response', withCredentials: true })
      .pipe(
        map(res => {
          this.userInfo = (res.body as UserInfo);
          return this.userInfo;
        })
      );
    // }
    // else
    //   return (UserInfo)this.userInfo;

    // return  this.http.post <HttpResponse<<User>>(`${this.server}User/Login`, user, this.httpOptions);

  }

  Logout() {
    localStorage.clear();
    return this.http.get(`${this.server}User/LogOut`, this.httpOptions);
  }

  //generate notification
  generateNotification(): Observable<Notification> {
    return this.http.get<Notification>(`${this.server}SupplierOrder/GenerateNotification`);
  }

  ForgotPassword(obj: ForgotPassword) {
    console.log(obj);
    this.OTPEmail = obj.Email;
    return this.http.post<ForgotPassword>(`${this.server}User/ForgotPassword`, obj);
  }

  ResetPassword(obj: ResetPassword) {
    return this.http.post<ResetPassword>(`${this.server}User/ResetPassword`, obj, this.httpOptions);
  }

  ResetForgottenPassword(obj: ResetForgottenPassword) {
    return this.http.post<ResetForgottenPassword>(`${this.server}User/ResetForgottenPassword`, obj);
  }

  MustMatch(obj: ResetPassword) {
    let noErrors = false;
    if (obj.newPassword === obj.confirmPassword) {
      noErrors = true;
      return noErrors;
    }
    else {
      noErrors = false;
      return noErrors;
    }
  }

  CheckOTP(input: number) {
    this.OTPobj.OTP = input;
    this.OTPobj.user = this.OTPEmail;
    console.log(this.OTPobj);
    return this.http.post(`${this.server}User/CheckOTP`, this.OTPobj);
  }

  getUserID() {
    return localStorage['user'];
  }

  getBranchID() {
    return localStorage['branch'];
  }

}
