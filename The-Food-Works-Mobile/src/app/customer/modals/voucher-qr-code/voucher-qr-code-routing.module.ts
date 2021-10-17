import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoucherQrCodePage } from './voucher-qr-code.page';

const routes: Routes = [
  {
    path: '',
    component: VoucherQrCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoucherQrCodePageRoutingModule {}
