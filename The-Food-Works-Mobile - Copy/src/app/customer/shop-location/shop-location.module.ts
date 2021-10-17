import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopLocationPageRoutingModule } from './shop-location-routing.module';

import { ShopLocationPage } from './shop-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShopLocationPageRoutingModule
  ],
  declarations: [ShopLocationPage]
})
export class ShopLocationPageModule {}
