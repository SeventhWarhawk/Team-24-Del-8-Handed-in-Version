import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoucherQrCodePageRoutingModule } from './voucher-qr-code-routing.module';

import { VoucherQrCodePage } from './voucher-qr-code.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoucherQrCodePageRoutingModule,
    QRCodeModule
  ],
  declarations: [VoucherQrCodePage]
})
export class VoucherQrCodePageModule {}
