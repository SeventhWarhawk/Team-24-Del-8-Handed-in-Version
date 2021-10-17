import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOrdersPageRoutingModule } from './view-orders-routing.module';

import { ViewOrdersPage } from './view-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOrdersPageRoutingModule
  ],
  declarations: [ViewOrdersPage]
})
export class ViewOrdersPageModule {}
