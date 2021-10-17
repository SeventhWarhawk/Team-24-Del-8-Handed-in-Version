import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EligibleVouchersPage } from './eligible-vouchers.page';

const routes: Routes = [
  {
    path: '',
    component: EligibleVouchersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EligibleVouchersPageRoutingModule {}
