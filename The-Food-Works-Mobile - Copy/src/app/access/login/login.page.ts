import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AccessService } from 'src/app/services/access.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  image: any;

  constructor(private fb: FormBuilder, private authService: AccessService, private router: Router,
    private loadingController: LoadingController, private toast: ToastController, private customerService: CustomerService,
    private driverService: DriverService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailAddress: ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
      ]],
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
  }

  doLogin() {
    this.presentLoading().then(() => {
      this.authService.login(this.loginForm.value).subscribe((res: any) => {
        if (res.userRole !== 'Driver') {
          this.loadingController.dismiss().then(() => {
            this.toast.dismiss();
            console.log(res);
            this.loginForm.reset();
            this.customerService.getVAT();
            this.router.navigateByUrl('shop-location');
          });
        } else {
          this.loadingController.dismiss().then(() => {
            this.toast.dismiss();
            this.loginForm.reset();
            this.router.navigateByUrl('driver-home');
          });
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.loadingController.dismiss();
          this.presentFailToast('Account has been deactivated.');
        } else {
          this.loadingController.dismiss();
          this.presentFailToast('Email or password incorrect.');
        }
      });
    });
  }

  async presentFailToast(errMessage: any) {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: errMessage,
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
}
