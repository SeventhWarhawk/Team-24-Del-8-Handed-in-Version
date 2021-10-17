import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewVoucherPageRoutingModule } from './view-voucher-routing.module';

import { ViewVoucherPage } from './view-voucher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewVoucherPageRoutingModule
  ],
  declarations: [ViewVoucherPage]
})
export class ViewVoucherPageModule {}
