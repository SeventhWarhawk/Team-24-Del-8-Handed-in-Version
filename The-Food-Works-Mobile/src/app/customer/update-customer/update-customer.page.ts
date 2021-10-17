/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, AlertController, IonSearchbar, ActionSheetController } from '@ionic/angular';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { AccessService } from 'src/app/services/access.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.page.html',
  styleUrls: ['./update-customer.page.scss'],
})
export class UpdateCustomerPage implements OnInit {

  updateForm: FormGroup;
  customerToUpdate: any;

  options: Options = {
    componentRestrictions: { country: 'za' },
    types: ['address'],
    bounds: null,
    strictBounds: null,
    fields: null,
    origin: null
  };

  constructor(private toast: ToastController, private alert: AlertController, private fb: FormBuilder, private service: CustomerService,
              public actionSheetController: ActionSheetController, private router: Router, private authService: AccessService) { }

  public handleAddressChange(address: Address) {
    this.updateForm.get('StreetName').setValue(`${address.address_components[0].long_name}, ${address.address_components[1].long_name}`);
    this.updateForm.get('City').setValue(address.address_components[2].long_name);
    this.updateForm.get('Province').setValue(address.address_components[4].long_name);
    this.updateForm.get('PostalCode').setValue(address.address_components[6].long_name);
    this.updateForm.get('Lat').setValue(address.geometry.location.lat());
    this.updateForm.get('Lng').setValue(address.geometry.location.lng());
  }

  ngOnInit() {
    this.service.getCustomerToUpdate().subscribe(res => {
      this.customerToUpdate = res;
      this.updateForm = this.fb.group({
        CustomerName: [this.customerToUpdate.customerName, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$')
          ])
        ],
        CustomerSurname: [this.customerToUpdate.customerSurname, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$')
          ])
        ],
        CustomerTelephone: [this.customerToUpdate.customerTelephone, Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.pattern('^[0-9]*$')
          ])
        ],
        IsLoyaltyProgram: [this.customerToUpdate.isLoyaltyProgram],
        StreetNumber: [this.customerToUpdate.streetNumber, Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]*$')
          ])
        ],
        StreetName: [this.customerToUpdate.streetName, Validators.required],
        City: [this.customerToUpdate.city, Validators.required],
        PostalCode: [this.customerToUpdate.postalCode, Validators.required],
        Province: [this.customerToUpdate.province, Validators.required],
        Lat: [this.customerToUpdate.lat, Validators.required],
        Lng: [this.customerToUpdate.lng, Validators.required],
      });
    });
  }

  presentConfirm() {
    this.updateAlert();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'More Account Options',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Deactivate Account',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deactivateAlert();
        }
      }, {
        text: 'Reset Password',
        icon: 'cloud-upload-outline',
        handler: () => {
          this.router.navigateByUrl('reset-password');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async updateAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Update Confirmation',
      message: 'Are you sure you want to update your details?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.service.doUpdateCustomer(this.updateForm.value).subscribe(res => {
              this.presentSuccessToast('Account successfully updated.');
            }, error => {
              this.presentFailToast('Unsuccessful validation.');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deactivateAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Deactivate Confirmation',
      message: 'Are you sure you want to deactivate your account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.service.deactivateCustomer().subscribe(res => {
              this.presentSuccessToast('Account successfully deactivated.');
              this.authService.doLogout();
            }, (error: HttpErrorResponse) => {
              if (error.status === 403) {
                this.presentFailToast('You still have outstanding orders.');
              } else {
                this.presentFailToast('Something went wrong.');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentSuccessToast(succMessage: any) {
    const toast = await this.toast.create({
      header: 'Success!',
      message: succMessage,
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
