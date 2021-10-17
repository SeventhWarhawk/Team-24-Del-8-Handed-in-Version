import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RewardsCenterPageRoutingModule } from './rewards-center-routing.module';

import { RewardsCenterPage } from './rewards-center.page';

// Third Party Imports
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RewardsCenterPageRoutingModule,
    NgCircleProgressModule.forRoot({
      showTitle: true,
      showSubtitle: true,
      showUnits: false,
      responsive: true,
      titleFontSize: '30',
      subtitleFontSize: '11',
      titleFontWeight: '700',
    })
  ],
  declarations: [RewardsCenterPage]
})
export class RewardsCenterPageModule {}
