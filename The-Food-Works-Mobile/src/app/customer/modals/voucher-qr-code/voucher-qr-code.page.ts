import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-voucher-qr-code',
  templateUrl: './voucher-qr-code.page.html',
  styleUrls: ['./voucher-qr-code.page.scss'],
})
export class VoucherQrCodePage implements OnInit {

  myAngularxQrCode: string = null;
  voucherCode: any;

  constructor(private modal: ModalController) { }

  ngOnInit() {
    console.log(this.voucherCode);
    this.myAngularxQrCode = this.voucherCode;
  }

  dismissModal() {
    this.modal.dismiss();
  }

}
