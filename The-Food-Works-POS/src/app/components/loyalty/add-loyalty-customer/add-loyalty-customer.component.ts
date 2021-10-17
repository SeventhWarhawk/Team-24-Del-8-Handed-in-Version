import { HttpErrorResponse } from '@angular/common/http';
import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';
import { combinedLoyaltyCustomer } from './../../../interfaces/loyalty';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-loyalty-customer',
  templateUrl: './add-loyalty-customer.component.html',
  styleUrls: ['./add-loyalty-customer.component.scss']
})
export class AddLoyaltyCustomerComponent implements OnInit {

  constructor(private fb: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar, private service: LoyaltyService, private dialogRef: MatDialogRef<AddLoyaltyCustomerComponent>) { }

  // Declerations
  addCustomerDetailsForm: FormGroup;
  addCustomerAddressForm: FormGroup;
  todaysDate = new Date();
  isLoading: boolean;

  ngOnInit(): void {
    this.isLoading = false;
    this.addBranchDetailsReactiveForm();
    this.addCustomerAddressReactiveForm();
  }

  // Form Group 1 - Branch Details (Step 1)
  addBranchDetailsReactiveForm() {
    console.log(this.todaysDate);
    this.addCustomerDetailsForm = this.fb.group({
      // Customer Name Control
      customerName: ['',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ],
      // Customer Surname Control
      customerSurname: ['',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ],
      // Customer Email Control
      customerEmail: ['',
        Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      ],
      // Customer Telephone Control
      customerTelephone: ['',
        Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])
      ],
      // Customer Date of Birth Control
      customerDob: ['', Validators.required]
    });
  }

  // Google Address Autocomplete
  // Data Members and Methods for Google Maps Places API
  address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  streetNumber: any; seperateName: any; streetName: any; streetAddress: any; suburb: any; city: any; province: any; country: any; zip: any; // Displayed

  addressOptions = {
    componentRestrictions: { country: "za" },
    types: ["address"]
  } as Options;

  public handleAddressChange(address: any) {

    // Place id (Not Displayed)
    this.placeId = address.place_id;
    console.log(this.placeId);

    // Latitude coordinate (Not Displayed)
    this.latitude = address.geometry.location.lat();
    console.log(this.latitude);

    // Longitude coordinate (Not Displayed)
    this.longitude = address.geometry.location.lng();
    console.log(this.longitude);

    // Reset street address on method refresh
    this.streetAddress = "";

    // Street Address (full unformatted) (Displayed)
    this.addCustomerAddressForm.get('customerAddressFull')?.setValue(address.formatted_address);

    // Street number (Displayed i.t.o)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "street_number") {
          this.streetAddress = JSON.parse(JSON.stringify(address.address_components[i].long_name)) + " ";
          this.streetNumber = JSON.parse(JSON.stringify(address.address_components[i].long_name))
        }
      }
    }

    this.addCustomerAddressForm.get('customerStreetNumberSeperate')?.setValue(this.streetNumber);

    // Street name (Displayed i.t.o)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "route") {
          this.streetAddress += JSON.parse(JSON.stringify(address.address_components[i].long_name));
          this.seperateName = JSON.parse(JSON.stringify(address.address_components[i].long_name))
        }
      }
    }

    this.addCustomerAddressForm.get('customerStreetNameSeperate')?.setValue(this.seperateName);

    // Set Street Name field to combined street name variable (this.streetAddress)
    this.addCustomerAddressForm.get('customerStreetName')?.setValue(this.streetAddress);

    // Reset suburb on method refresh
    this.suburb = "";

    // Suburb (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "sublocality") {
          this.addCustomerAddressForm.get('customerSuburb')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset city on method refresh
    this.city = "";

    // City (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "locality") {
          this.addCustomerAddressForm.get('customerCity')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset province on method refresh
    this.province = "";

    // Province (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "administrative_area_level_1") {
          this.addCustomerAddressForm.get('customerProvince')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset country on method refresh
    this.country = "";

    // Country (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "country") {
          this.addCustomerAddressForm.get('customerCountry')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset zip on method refresh
    this.zip = "";

    // ZIP (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "postal_code") {
          this.addCustomerAddressForm.get('customerZip')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Latitude Control (Not displayed)
    this.addCustomerAddressForm.get('customerLat')?.setValue(this.latitude);

    // Longitude Control (Not displayed)
    this.addCustomerAddressForm.get('customerLng')?.setValue(this.longitude);

  }

  // Form Group 2 - Customer Address (Step 2)
  addCustomerAddressReactiveForm() {
    this.addCustomerAddressForm = this.fb.group({
      // Customer Address Control
      customerAddressFull: ['',
        Validators.compose([Validators.required])
      ],
      // Customer Street Name Control
      customerStreetName: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],

      // Customer Street Name Seperate Control (Hidden)
      customerStreetNameSeperate: [{ value: '', disabled: true}],

      // Customer Street Number Seperate Control (Hidden)
      customerStreetNumberSeperate: [{ value: '', disabled: true}],

      // Customer Suburb Control
      customerSuburb: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Customer City Control
      customerCity: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Customer Province Control
      customerProvince: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Customer Country Control
      customerCountry: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Customer ZIP Control
      customerZip: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Customer Latitude Control (Hidden)
      customerLat: [{ value: '', disabled: true }],

      // Customer Longitude Control (Hidden)
      customerLng: [{ value: '', disabled: true }]
    });
  }

  // Error Handler (Used for conditional validation errors)
  public errorHandling = (control: string, error: string) => {
    return this.addCustomerDetailsForm.controls[control].hasError(error);
  }

  // Method to Create a customer on submit
  createCustomer() {
    const customer: combinedLoyaltyCustomer = {
      details: this.addCustomerDetailsForm.value,
      address: this.addCustomerAddressForm.getRawValue()
    }
    console.log(customer);
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm New Customer Addition',
        message: 'Are you sure you would like to confirm this addition?'
      }
    });
    confirm.afterClosed().subscribe(resp => {
      if (resp) {
        this.isLoading = true;
        this.service.addLoyaltyCustomer(customer).subscribe((resp: any) => {
          this.isLoading = false;
          console.log("Loyalty Customer Registered")
          this.displaySuccessMessage("Customer Added and Registered Successfully");
          this.dialogRef.close();
        }, (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error.status)
          if(error.status == 403) {
            this.displayErrorMessage("Customer Already Exists");
          } else {
            this.displayErrorMessage("An Error Occured on the Server Side");
          }
        })
      }
    });
  }

  displayErrorMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }

  displaySuccessMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['success-snackbar']
    });
  }

}
