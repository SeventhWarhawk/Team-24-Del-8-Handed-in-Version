/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  password: string;

  options: Options = {
    componentRestrictions: { country: 'za' },
    types: ['address'],
    bounds: null,
    strictBounds: null,
    fields: null,
    origin: null
  };

  constructor(private toast: ToastController, private alert: AlertController, private fb: FormBuilder, private service: AccessService,
              private router: Router, private loadingController: LoadingController) { }

  public handleAddressChange(address: Address) {
    this.registerForm.get('StreetName').setValue(`${address.address_components[0].long_name}, ${address.address_components[1].long_name}`);
    this.registerForm.get('City').setValue(address.address_components[2].long_name);
    this.registerForm.get('Province').setValue(address.address_components[4].long_name);
    this.registerForm.get('PostalCode').setValue(address.address_components[6].long_name);
    this.registerForm.get('Lat').setValue(address.geometry.location.lat());
    this.registerForm.get('Lng').setValue(address.geometry.location.lng());
  }


  ngOnInit() {
    this.registerForm = this.fb.group({
      CustomerName: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ])
      ],
      CustomerSurname: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ])
      ],
      CustomerDob: ['', [
          Validators.required,
        ]
      ],
      CustomerTelephone: ['', Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$')
        ])
      ],
      CustomerEmail: ['', Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ])
      ],
      IsLoyaltyProgram: [false],
      StreetNumber: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$')
        ])
      ],
      StreetName: ['', Validators.required],
      City: ['', Validators.required],
      PostalCode: ['', Validators.required],
      Province: ['', Validators.required],
      Lat: [''],
      Lng: ['', Validators.required],
      Password: ['', [
          Validators.required,
        ]
      ],
      ConfirmPassword: ['', []]
    });

    this.registerForm.get('Password').valueChanges
      .subscribe(inputValue => {
        const confirmPassword = this.registerForm.get('ConfirmPassword');
        if (inputValue !== '') {
          confirmPassword?.setValidators([Validators.required, Validators.pattern(inputValue)]);
        } else {
          confirmPassword?.clearValidators();
        }
        confirmPassword?.updateValueAndValidity();
    });
  }

  presentConfirm() {
    this.createAlert();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
  }

  async createAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Account Confirmation',
      message: 'Are you sure you want to create an account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.presentLoading().then(() => {
              this.service.registerCustomer(this.registerForm.value).subscribe(res => {
                this.loadingController.dismiss().then(() => {
                  this.presentSuccessToast().then(() => {
                    this.router.navigateByUrl('login');
                  });
                });
              }, (error: HttpErrorResponse) => {
                if (error.status === 403) {
                  this.loadingController.dismiss();
                  this.presentFailToast('User already exists.');
                } else {
                  this.loadingController.dismiss();
                  this.presentFailToast('Something went wrong.');
                }
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Account has been successfully created.',
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

  async presentFailToast(errMessage: string) {
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
