import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private service: AccessService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
    // formbuilder formgroup and form validation
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', [
        Validators.required,
      ]],
      newPassword: ['', [
        Validators.required,
      ]],
      confirmPassword: ['', []]
    });

    this.resetPasswordForm.get('newPassword').valueChanges
      .subscribe(inputValue => {
        const confirmPassword = this.resetPasswordForm.get('confirmPassword');
        if (inputValue !== '') {
          confirmPassword?.setValidators([Validators.required, Validators.pattern(inputValue)]);
        } else {
          confirmPassword?.clearValidators();
        }
        confirmPassword?.updateValueAndValidity();
    });
  }

  doResetPassword() {
    this.service.resetPassword(this.resetPasswordForm.value).subscribe(res => {
      this.presentSuccessToast();
      this.service.doLogout();
    }, error => {
      this.presentFailToast();
    });
  }

  async presentSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Password reset successfully.',
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
}
