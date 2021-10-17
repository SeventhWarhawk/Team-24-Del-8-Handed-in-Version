import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessService } from 'src/app/services/access.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-shop-location',
  templateUrl: './shop-location.page.html',
  styleUrls: ['./shop-location.page.scss'],
})
export class ShopLocationPage implements OnInit, OnDestroy {

  subscription: Subscription;
  shopLocationForm: FormGroup;
  locations: any;
  isLoggedIn: any;
  customerName: string;

  constructor(private fb: FormBuilder, private service: CustomerService, private authService: AccessService) { }

  ngOnInit() {
    // formbuilder formgroup and form validation
    this.shopLocationForm = this.fb.group({
      shopLocation: ['', [
        Validators.required,
      ]],
    });

    this.service.getBranchData().subscribe(data => {
      this.locations = data;
    });

    this.checkLogin();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.checkLogin();

    this.service.getVAT().subscribe(data => {
      this.service.setVAT(data);
    });
  }

  onChange(value) {
    this.service.setBranchID(value);
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
