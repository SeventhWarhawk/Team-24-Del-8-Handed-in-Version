import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {

  myAngularxQrCode: string = null;
  orderNumber: any;
  customerID: any;

  constructor(private modal: ModalController) {
  }

  ngOnInit() {
    this.myAngularxQrCode = 'or:' + this.orderNumber.toString() + ':' + this.customerID.toString();
  }

  dismissModal() {
    this.modal.dismiss();
  }
}
