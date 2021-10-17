import { VoucherQrCodePage } from './../modals/voucher-qr-code/voucher-qr-code.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewVoucherPage } from '../modals/view-voucher/view-voucher.page';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.page.html',
  styleUrls: ['./vouchers.page.scss'],
})
export class VouchersPage implements OnInit {

  // Declarations
  voucher: any = [];
  voucherFlag: boolean;
  searchTerm: any;
  loadingFlag: any;

  constructor(public modal: ModalController, private service: CustomerService) { }

  ngOnInit() {
    this.loadingFlag = false;
    this.service.getVoucherInformation().subscribe((resp: any) => {
      this.loadingFlag = true;
      this.voucher = resp;
      if (this.voucher.length === 0) {
        this.voucherFlag = true;
      } else {
        this.voucherFlag = false;
      }
      console.log(resp);
    }, (error: any) => {
      console.log('Unable to get voucher information');
    });
  }

  // Present View Voucher Dialog
  async presentViewModal(code: any, id: any) {
    const modal = await this.modal.create({
      component: ViewVoucherPage,
      swipeToClose: true,
      componentProps: {
        voucherCode: code,
        voucher: this.voucher,
        voucherId: id
      }
    });
    return await modal.present();
  }

  // Present QR Voucher Dialog
  async presentQrModal(code: any) {
    const modal = await this.modal.create({
      component: VoucherQrCodePage,
      swipeToClose: true,
      componentProps: {
        voucherCode: code
      }
    });
    return await modal.present();
  }

}
