/* eslint-disable @typescript-eslint/no-unused-expressions */
import { EligibleVouchersPage } from './../modals/eligible-vouchers/eligible-vouchers.page';
import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ICartItem } from 'src/app/interfaces/cart';
import { CustomerService } from 'src/app/services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, AfterViewInit {

  checkoutForm: FormGroup;
  deliveryDisable: boolean;
  payStoreDisable: boolean;
  isPay = true;
  confirmDelivery: string;
  checkoutTotal: any;
  cartItems: ICartItem[];
  vatPercentage: number;
  vatAmount: any;
  cardToken: string;
  roundedTotal: any;
  deliveryTouched: boolean;

  // Voucher Declerations
  vouchers: any;
  voucherAmount?: any;
  voucherCode?: any;
  voucherId?: any;
  voucherFlag: any;
  isVoucherApplicable: boolean;
  paymentChosen: boolean;
  voucherMessage: boolean;
  voucherAmountUsed: any;
  atAdditionAmount: any;
  voucherRemaining: any;

  //Vassislis DROSS

  constructor(private fb: FormBuilder, private alert: AlertController, public navCtrl: NavController,
    private service: CustomerService, private router: Router, private loadingController: LoadingController,
    private toast: ToastController, private currency: CurrencyPipe, public modal: ModalController) { }

  ngOnInit() {
    this.isVoucherApplicable = true;
    this.checkoutForm = this.fb.group({
      completionMethod: ['', [
        Validators.required,
      ]],
      paymentMethod: ['', [
        Validators.required,
      ]]
    });

    this.vatPercentage = this.service.vatPercentage;

    this.service.getAllCartItems().subscribe((data: any) => {
      this.cartItems = data;
      console.log(data);
      this.checkoutTotal = 0;
      this.vatAmount = 0;
      this.roundedTotal = 0;
      this.cartItems.forEach(element => {
        const productTotal = (element.productPrice * element.quantity);
        this.checkoutTotal += productTotal;
        this.vatAmount += (productTotal * (this.vatPercentage / 100));
      });
      this.atAdditionAmount = this.checkoutTotal;
      this.convertToCents(this.checkoutTotal);
      if (this.checkoutTotal <= 20) {
        this.voucherMessage = true;
        this.isVoucherApplicable = false;
      } else {
        this.voucherMessage = false;
      }
    });

    this.service.getEligibleVouchers().subscribe((resp: any) => {
      console.log(resp);
      this.vouchers = resp;
    }, (errors: any) => {
      console.log('Unable to fetch eligible vouchers');
    });
  }

  ngAfterViewInit() {
    this.getYoco().then(yoco => {
      const script = document.createElement('script');
      script.src = '../../../assets/scripts/yoco.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }).catch(err => {
      console.log(err);
    });
  }

  // Present Eligible Vouchers Page
  async presentVoucherModal() {
    const modal = await this.modal.create({
      component: EligibleVouchersPage,
      swipeToClose: true,
      componentProps: {
        vouchers: this.vouchers
      }
    });
    modal.onDidDismiss().then((isClose) => {
        this.voucherId = isClose.data.voucherId;
        this.voucherAmount = isClose.data.voucherAmount;
        this.voucherCode = isClose.data.voucherCode;
        if (this.voucherId) {
          // Calculate Amount to Subtract (Leave R20)
          const difference = this.checkoutTotal - 20;
          if (this.voucherAmount > difference) {
            this.voucherRemaining = this.voucherAmount - difference;
            this.voucherAmount = difference;
            this.checkoutTotal = this.checkoutTotal - this.voucherAmount;
          } else {
            this.voucherRemaining = 0;
            this.checkoutTotal = this.checkoutTotal - this.voucherAmount;
          }
          // Convert to readable format
          this.convertToCents(this.checkoutTotal);
          this.voucherFlag = true;
          this.isVoucherApplicable = false;
        } else {
          this.isVoucherApplicable = true;
          this.voucherFlag = false;
        }
    }, (error: any) => {
      console.log('Unable to get selected voucher');
    });
    return await modal.present();
  }

  // Remove Selected Voucher
  removeVoucher() {
    this.checkoutTotal = this.checkoutTotal + this.voucherAmount;
    this.convertToCents(this.checkoutTotal);
    this.voucherId = null;
    this.voucherAmount = null;
    this.voucherCode = null;
    this.voucherFlag = false;
    if (!this.isVoucherApplicable && this.paymentChosen) {
      this.isVoucherApplicable = false;
    } else {
      this.isVoucherApplicable = true;
    }
  }

  onCompSelect(event: any) {
    if (event.detail.value === '1') {
      this.payStoreDisable = true;
      // eslint-disable-next-line max-len
      this.confirmDelivery = '<br><hr><ion-icon name="alert-circle-outline"></ion-icon> Please ensure your account address is correct before proceeding.';
      this.checkoutTotal += 30;
      this.convertToCents(this.checkoutTotal);
      this.deliveryTouched = true;
    } else {
      this.payStoreDisable = false;
      this.confirmDelivery = '';
      if (this.deliveryTouched) {
        this.checkoutTotal -= 30;
        this.convertToCents(this.checkoutTotal);
        this.deliveryTouched = false;
      }
      if (this.checkoutTotal < 20) {
        this.removeVoucher();
      }
    }
  }

  onPaySelect(event: any) {
    if (event.detail.value === '1') {
      this.paymentChosen = true;
      this.deliveryDisable = true;
      this.isPay = false;
      if (this.voucherAmount) {
        this.isVoucherApplicable = false;
        this.removeVoucher();
      } else {
        this.isVoucherApplicable = false;
      }
      console.log(this.isVoucherApplicable);
    } else {
      this.paymentChosen = false;
      this.deliveryDisable = false;
      this.isPay = true;
      if (this.checkoutTotal > 20) {
        this.isVoucherApplicable = true;
      } else {
        this.isVoucherApplicable = false;
      }
      console.log(this.isVoucherApplicable);
    }
  }

  convertToCents(total: any) {
    this.roundedTotal = this.currency.transform(total,'ZAR', '', '1.2-2').replace(/,/g, '').replace('.', '');
  }

  async presentAlertConfirm() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Order',
      message: 'Your order total is R ' + this.currency.transform(this.checkoutTotal,'ZAR', '', '1.2-2') +
                this.confirmDelivery,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.doCheckout();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
  }

  doCheckout(){
    this.presentLoading().then(() => {
      const data = {
        token: this.cardToken,
        amount: this.roundedTotal,
        completionMethod: this.checkoutForm.get('completionMethod').value,
        paymentMethod: this.checkoutForm.get('paymentMethod').value
      };
      this.service.doCheckout(data).subscribe(res => {
        this.loadingController.dismiss().then(() => {
          this.router.navigateByUrl('thank-you');
        });
      }, error => {
        this.loadingController.dismiss().then(() => {
          this.presentFailToast();
        });
      });
    });
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Something went wrong.',
      position: 'top',
      color: 'danger',
      duration: 2000,
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  private getYoco(): Promise<any> {
    const win = window as any;
    const yocoModule = win.YocoSDK;
    if (yocoModule) {
      return Promise.resolve(yocoModule);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedYocoModule = win.YocoSDK;
        if(loadedYocoModule) {
          resolve(loadedYocoModule);
        } else {
          reject('Yoco SDK not available');
        }
      };
    });
  }
}
