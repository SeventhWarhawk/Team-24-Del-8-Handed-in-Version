import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-reset-forgotten-password',
  templateUrl: './reset-forgotten-password.page.html',
  styleUrls: ['./reset-forgotten-password.page.scss'],
})
export class ResetForgottenPasswordPage implements OnInit {

  resetForgottenPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private service: AccessService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
    // formbuilder formgroup and form validation
    this.resetForgottenPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
      ]],
      confirmPassword: ['', [ ]],
    });

    this.resetForgottenPasswordForm.get('newPassword').valueChanges
      .subscribe(inputValue => {
        const confirmPassword = this.resetForgottenPasswordForm.get('confirmPassword');
        if (inputValue !== '') {
          confirmPassword?.setValidators([Validators.required, Validators.pattern(inputValue)]);
        } else {
          confirmPassword?.clearValidators();
        }
        confirmPassword?.updateValueAndValidity();
    });
  }

  doResetPassword() {
    this.service.resetForgottenPassword(this.resetForgottenPasswordForm.get('newPassword').value).subscribe(res => {
      this.router.navigateByUrl('login');
    }, error => {
      this.presentFailToast();
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

}
