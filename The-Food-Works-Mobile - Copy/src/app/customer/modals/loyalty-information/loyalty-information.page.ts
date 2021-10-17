import { CustomerService } from 'src/app/services/customer.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loyalty-information',
  templateUrl: './loyalty-information.page.html',
  styleUrls: ['./loyalty-information.page.scss'],
})
export class LoyaltyInformationPage implements OnInit {

  customer: any;

  constructor(private modal: ModalController,
    public alert: AlertController,
    private service: CustomerService,
    private toast: ToastController,
    private router: Router,
    private loadingController: LoadingController) { }

  ngOnInit() {
  }

  dismissModal(isClose: boolean) {
    this.modal.dismiss(isClose);
  }

  async unsubscribe() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Unsubscribe from Loyalty Confirmation',
      message: 'Are you sure you want to unsubscribe from the loyalty program?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Unsubscribe',
          handler: () => {
            this.presentLoading().then(() => {
              this.service.unsubscribeMember().subscribe(res => {
                this.presentJoinSuccessToast();
                this.router.navigateByUrl('shop-location');
                this.modal.dismiss();
                this.loadingController.dismiss();
              }, error => {
                this.loadingController.dismiss().then(() => {
                this.presentFailToast();
                });
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Toasts
  async presentJoinSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'You have unsubscribed from the loyalty program!',
      position: 'top',
      color: 'success',
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
  }

}
