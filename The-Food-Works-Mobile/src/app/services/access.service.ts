/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../access/login/user.model';
import { IAuthResponse, ICustomer, IResetForgottenPassword, IResetPassword, IUser } from '../interfaces/access';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class AccessService implements OnDestroy {

  email: string;

  httpOptions = {
    headers: new HttpHeaders({
      contentType: 'application/json',
    })
  };

  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from(Storage.get({key: 'authData'})).pipe(map((storedData: any) => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {userID: string; displayName: string; userRole: string; token: string; tokenExpirationDate: string};
      const expirationTime = new Date(parsedData.tokenExpirationDate);
      if (expirationTime <= new Date()) {
        return null;
      }
      const user = new User(parsedData.userID, parsedData.displayName, parsedData.userRole, parsedData.token, expirationTime);
      return user;
    }), tap(user => {
        if (user){
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }), map(user => {
        return !!user;
      })
    );
  }

  login(user: IUser) {
    return this.http.post<IAuthResponse>(environment.baseURI + 'MobileUser/Login', user, this.httpOptions).pipe(tap(this.setUserData.bind(this)));
  }

  doLogout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({key: 'authData'});
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }

  get userID() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  get token() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    }));
  }

  get displayName() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.displayName;
      } else {
        return null;
      }
    }));
  }

  get userRole() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.userRole;
      } else {
        return null;
      }
    }));
  }


  registerCustomer(body: ICustomer) {
    return this.http.post(environment.baseURI + 'Customer/RegisterCustomer', body);
  }

  forgotPassword(userEmail: any) {
    const body = {
      Email: userEmail
    };
    this.email = userEmail;
    return this.http.post(environment.baseURI + 'User/ForgotPassword', body);
  }

  checkOTP(otp: any) {
    const body = {
      user: this.email,
      OTP: otp
    };
    console.log(body);
    return this.http.post(environment.baseURI + 'User/CheckOTP', body);
  }

  resetForgottenPassword(newPassword: any) {
    const body: IResetForgottenPassword = {
      email: this.email,
      NewPassword: newPassword,
    };
    return this.http.post(environment.baseURI + 'User/ResetForgottenPassword', body);
  }

  resetPassword(formData: any) {
    return this.userID.pipe(take(1), switchMap(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      const body: IResetPassword = {
        CustomerID: +userID,
        CurrentPassword: formData.currentPassword,
        NewPassword: formData.newPassword,
        email: '',
        ConfirmPassword: ''
      };
      return this.http.post(environment.baseURI + 'User/ResetPassword', body);
    }));
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.doLogout();
    }, duration);
  }

  private setUserData(userData: IAuthResponse) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.userID, userData.displayName, userData.userRole, userData.token, expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.userID, userData.displayName, userData.userRole, userData.token, expirationTime.toISOString());
  }

  private storeAuthData(userID: string, displayName: string, userRole: string, token: string, tokenExpirationDate: string) {
    const data = JSON.stringify({userID: userID, displayName: displayName, userRole: userRole, token: token, tokenExpirationDate: tokenExpirationDate});
    Storage.set({key: 'authData', value: data});
  }
}
