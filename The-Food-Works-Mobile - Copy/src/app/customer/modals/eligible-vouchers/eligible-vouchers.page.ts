import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-eligible-vouchers',
  templateUrl: './eligible-vouchers.page.html',
  styleUrls: ['./eligible-vouchers.page.scss'],
})
export class EligibleVouchersPage implements OnInit {

  vouchers: any;
  voucherFlag: any;

  constructor(private modal: ModalController) { }

  ngOnInit() {
    if(this.vouchers.length === 0) {
      this.voucherFlag = true;
    } else {
      this.voucherFlag = false;
    }
    console.log(this.vouchers);
  }

  dismissModal() {
    this.modal.dismiss();
  }

  dismissInfoModal(id: any, amount: any, code: any) {
    const selectedVoucher = {
      voucherId: id,
      voucherAmount: amount,
      voucherCode: code
    };
    this.modal.dismiss(selectedVoucher);
  }

}
