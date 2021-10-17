import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateCustomerPageRoutingModule } from './update-customer-routing.module';

import { UpdateCustomerPage } from './update-customer.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateCustomerPageRoutingModule,
    ReactiveFormsModule,
    GooglePlaceModule
  ],
  declarations: [UpdateCustomerPage]
})
export class UpdateCustomerPageModule {}
