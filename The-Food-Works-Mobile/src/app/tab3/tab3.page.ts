import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccessService } from '../services/access.service';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

  loyaltyFlag: boolean;
  loadingFlag: boolean;
  isLoggedIn: any;
  customerName: string;
  subscription: Subscription;

  constructor(private authService: AccessService, private service: CustomerService) {}

  ngOnInit() {
    this.loadingFlag = false;
    this.service.getLoyaltyStatus().subscribe((resp: any) => {
      if (resp) {
        this.loyaltyFlag = true;
      } else {
        this.loyaltyFlag = false;
      }
      this.loadingFlag = true;
    });
  }

  ionViewWillEnter() {
    this.checkLogin();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  doLogout() {
    this.authService.doLogout();
  }

  checkLogin() {
    this.subscription = this.authService.displayName.subscribe(displayName => {
      if(displayName) {
        this.isLoggedIn = true;
        this.customerName = displayName;
      } else {
        this.isLoggedIn = false;
      }
    });
  }
}
