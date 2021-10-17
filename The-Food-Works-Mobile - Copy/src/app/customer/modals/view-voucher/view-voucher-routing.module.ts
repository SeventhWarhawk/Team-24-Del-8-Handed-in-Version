import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewVoucherPage } from './view-voucher.page';

const routes: Routes = [
  {
    path: '',
    component: ViewVoucherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewVoucherPageRoutingModule {}
