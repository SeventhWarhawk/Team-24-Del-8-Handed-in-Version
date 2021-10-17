import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverMapPageRoutingModule } from './driver-map-routing.module';

import { DriverMapPage } from './driver-map.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverMapPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [DriverMapPage],
  providers: [LaunchNavigator]
})
export class DriverMapPageModule {}
