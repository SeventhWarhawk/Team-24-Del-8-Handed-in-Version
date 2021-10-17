import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EligibleVouchersPageRoutingModule } from './eligible-vouchers-routing.module';

import { EligibleVouchersPage } from './eligible-vouchers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EligibleVouchersPageRoutingModule
  ],
  declarations: [EligibleVouchersPage]
})
export class EligibleVouchersPageModule {}
