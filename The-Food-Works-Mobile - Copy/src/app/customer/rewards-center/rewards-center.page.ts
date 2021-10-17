import { CustomerService } from 'src/app/services/customer.service';
import { LoyaltyInformationPage } from './../modals/loyalty-information/loyalty-information.page';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-rewards-center',
  templateUrl: './rewards-center.page.html',
  styleUrls: ['./rewards-center.page.scss'],
})
export class RewardsCenterPage implements OnInit {

  // Declerations
  daysProgress: any;
  voucherAmount: any;
  progress: any = [];
  customerInfo: any = [];
  title: any;
  subtitle: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // Flags
  progressFlag: boolean;
  vouchersFlag: boolean;
  customerFlag: boolean;

  constructor(public modal: ModalController, private service: CustomerService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.progressFlag = false;
    this.vouchersFlag = false;
    this.customerFlag = false;
    this.subtitle = 'Days till next voucher';
    // Progress Info
    this.service.getProgressInformation().subscribe((resp: any) => {
      this.progressFlag = true;
      this.progress = resp;
      const todaysDate = new Date();
      const newNowDate = formatDate(todaysDate, 'YYYY-MM-dd', 'en-ZA');
      const start = moment(newNowDate, 'YYYY-MM-DD');
      const end = moment(this.progress[0].nextVoucherDate, 'YYYY-MM-DD');
      const duration = moment.duration(end.diff(start));
      this.title = duration.asDays();
      this.daysProgress = this.title * 100 / 365;
      this.daysProgress = 100 - this.daysProgress;
      console.log(resp);
    }, (error: any) => {
      console.log('Unable to fetch loyalty progress information');
    });
    // Voucher Info
    this.service.getVoucherInformation().subscribe((resp: any) => {
      this.vouchersFlag = true;
      this.voucherAmount = resp.length;
      console.log(resp);
    }, (error: any) => {
      console.log('Unable to get voucher information');
    });
    // Customer Info
    this.service.getCustomerInformation().subscribe((resp: any) => {
      this.customerFlag = true;
      this.customerInfo = resp;
      console.log(resp);
    }, (error: any) => {
      console.log('Cannot get customer info');
    });
  }

  // Present Loyalty Information Dialog
  async presentModal() {
    const modal = await this.modal.create({
      component: LoyaltyInformationPage,
      swipeToClose: true,
      componentProps: {
        customer: this.customerInfo
      }
    });
    return await modal.present();
  }
}
