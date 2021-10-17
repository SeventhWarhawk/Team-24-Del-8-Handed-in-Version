import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoyaltyInformationPageRoutingModule } from './loyalty-information-routing.module';

import { LoyaltyInformationPage } from './loyalty-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoyaltyInformationPageRoutingModule
  ],
  declarations: [LoyaltyInformationPage]
})
export class LoyaltyInformationPageModule {}
