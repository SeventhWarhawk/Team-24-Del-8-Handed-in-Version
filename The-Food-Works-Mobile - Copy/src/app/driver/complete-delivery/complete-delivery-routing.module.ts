import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompleteDeliveryPage } from './complete-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteDeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteDeliveryPageRoutingModule {}
