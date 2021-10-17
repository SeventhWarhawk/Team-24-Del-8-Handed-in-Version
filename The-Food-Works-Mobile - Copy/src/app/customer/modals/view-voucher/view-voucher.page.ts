import { CustomerService } from 'src/app/services/customer.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-voucher',
  templateUrl: './view-voucher.page.html',
  styleUrls: ['./view-voucher.page.scss'],
})
export class ViewVoucherPage implements OnInit {

  voucher: any;
  filteredVoucher: any;
  voucherCode: any;
  redemptions: any = [];
  voucherId: any;

  constructor(private modal: ModalController, private service: CustomerService) { }

  ngOnInit() {
    this.filteredVoucher = this.voucher.filter(x => x.voucherCode === this.voucherCode);
    this.service.getRedemptions(this.voucherId).subscribe((resp: any) => {
      this.redemptions = resp;
      console.log(resp);
    }, (error: any) => {
      console.log('Unable to get redemption records');
    });
  }

  dismissModal(isClose: boolean) {
    this.modal.dismiss(isClose);
  }

}
