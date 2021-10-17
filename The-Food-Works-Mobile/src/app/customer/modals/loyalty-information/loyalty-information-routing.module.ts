import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoyaltyInformationPage } from './loyalty-information.page';

const routes: Routes = [
  {
    path: '',
    component: LoyaltyInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoyaltyInformationPageRoutingModule {}
