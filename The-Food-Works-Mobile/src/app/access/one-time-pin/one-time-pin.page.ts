/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-one-time-pin',
  templateUrl: './one-time-pin.page.html',
  styleUrls: ['./one-time-pin.page.scss'],
})
export class OneTimePinPage implements OnInit {

  otpForm: FormGroup;

  constructor(private fb: FormBuilder, private service: AccessService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
    // formbuilder formgroup and form validation
    this.otpForm = this.fb.group({
      OTP: ['', [
        Validators.required,
      ]],
    });
  }

  checkOTP() {
    this.service.checkOTP(this.otpForm.get('OTP').value).subscribe(res => {
      this.router.navigateByUrl('reset-forgotten-password');
    }, error => {
      this.presentFailToast();
    });
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Please enter a valid one time pin.',
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
