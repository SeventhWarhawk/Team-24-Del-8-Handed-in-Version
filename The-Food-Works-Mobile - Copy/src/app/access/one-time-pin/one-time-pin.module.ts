import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneTimePinPageRoutingModule } from './one-time-pin-routing.module';

import { OneTimePinPage } from './one-time-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OneTimePinPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OneTimePinPage]
})
export class OneTimePinPageModule {}
