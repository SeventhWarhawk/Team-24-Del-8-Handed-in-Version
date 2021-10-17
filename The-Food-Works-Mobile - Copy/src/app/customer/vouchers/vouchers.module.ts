import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VouchersPageRoutingModule } from './vouchers-routing.module';

import { VouchersPage } from './vouchers.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VouchersPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [VouchersPage]
})
export class VouchersPageModule {}
