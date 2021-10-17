import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompleteDeliveryPageRoutingModule } from './complete-delivery-routing.module';

import { CompleteDeliveryPage } from './complete-delivery.page';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompleteDeliveryPageRoutingModule,
    SignaturePadModule
  ],
  declarations: [CompleteDeliveryPage]
})
export class CompleteDeliveryPageModule {}
