import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessService } from './services/access.service';
import { App, AppState } from '@capacitor/app';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private authSub: Subscription;
  private previousAuthState = false;

  constructor(private authService: AccessService, private router: Router) {}

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('login');
      }
      this.previousAuthState = isAuth;
    });

    App.addListener('appStateChange', (isActive: AppState) => {
      this.checkAuthOnResume(isActive);
    });

    this.doAutoLogin();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }


  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.doAutoLogin();
    }
  }

  private doAutoLogin() {
    this.authService
    .autoLogin()
    .pipe(take(1))
    .subscribe(success => {
      if (!success) {
        this.authService.doLogout();
      }
    });
  }
}
