/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/ban-types */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-complete-delivery',
  templateUrl: './complete-delivery.page.html',
  styleUrls: ['./complete-delivery.page.scss'],
})
export class CompleteDeliveryPage implements OnInit, AfterViewInit {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signatureImg: string;
  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 325,
    'canvasHeight': 200
  };

  hasSign = false;
  completeInfo: any;
  isProgress = false;

  constructor(private service: DriverService, private router: Router, private toast: ToastController, private alert: AlertController) { }

  ngOnInit() {
    this.service.getCompleteInfo().subscribe(res => {
      this.completeInfo = res;
    });
  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }

  drawComplete() {
    this.hasSign = true;
  }

  drawStart() {
    console.log('begin drawing');
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
  }

  clearSignature() {
    this.hasSign = false;
    this.signaturePad.clear();
  }

  doComplete() {
    this.isProgress = true;
    this.service.completeDelivery(this.signatureImg).subscribe(res => {
      this.presentSuccessToast('Delivery successfully completed.');
      this.checkDeliveries();
      this.clearSignature();
      this.isProgress = false;
    }, error => {
      this.presentFailToast();
      this.isProgress = false;
    });
  }

  doReturn() {
    this.isProgress = true;
    this.service.returnDelivery().subscribe(res => {
      this.presentSuccessToast('Delivery successfully returned.');
      this.checkDeliveries();
      this.isProgress = false;
    }, error => {
      this.presentFailToast();
      this.isProgress = false;
    });
  }

  checkDeliveries() {
    this.service.getRoute().subscribe((res: any) => {
      if(res.length > 0){
        this.router.navigateByUrl('driver-map');
      } else {
        this.router.navigateByUrl('driver-home');
      }
    });
  }

  async presentConfirmReturn() {
    this.savePad();
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Return Order',
      message: 'Are you sure you want to return this order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.doReturn();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentConfirmComplete() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Complete Order',
      message: 'Are you sure you want to complete this order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.doComplete();
          }
        }
      ]
    });
    await alert.present();
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

  async presentSuccessToast(notificationMessage: string) {
    const toast = await this.toast.create({
      header: 'Success!',
      message: notificationMessage,
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
}
