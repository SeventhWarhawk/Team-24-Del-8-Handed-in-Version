import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OneTimePinPage } from './one-time-pin.page';

const routes: Routes = [
  {
    path: '',
    component: OneTimePinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OneTimePinPageRoutingModule {}
