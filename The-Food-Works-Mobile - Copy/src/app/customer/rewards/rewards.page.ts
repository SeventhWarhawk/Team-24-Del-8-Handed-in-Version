import { CustomerService } from 'src/app/services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  // Declerations
  dateForm!: FormGroup;
  customerDob: any;
  customerEmail: any;
  customerId: any;
  format = 'yyyy-MM-dd';
  myDate = new Date();
  locale = 'en-ZA';
  formattedDate = formatDate(this.myDate, this.format, this.locale);

  constructor(private fb: FormBuilder,
    public alert: AlertController,
    private toast: ToastController,
    private service: CustomerService,
    private router: Router,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.dateForm = this.fb.group({
      customerDob: ['', Validators.required]
    });
  }

  async addToLoyalty() {
    this.customerDob = this.dateForm.controls.customerDob.value;
    console.log(this.formattedDate);
    this.service.getLoyaltyCustomerInfo().subscribe((resp: any) => {
      this.customerEmail = resp.userUsername;
      this.customerId = resp.customerId;
    }, (error: any) => {
      console.log('No Customer Found');
    });
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Join Loyalty Confirmation',
      message: 'Are you sure you want to join the loyalty program?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Join',
          handler: () => {
            this.presentLoading().then(() => {
              const newLoyalty = {
                email: this.customerEmail,
                dob: this.customerDob,
                id: this.customerId
              };
              this.service.addToLoyalty(newLoyalty).subscribe(res => {
                this.presentJoinSuccessToast();
                this.router.navigateByUrl('shop-location');
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
      message: 'You are now a loyalty member!',
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
