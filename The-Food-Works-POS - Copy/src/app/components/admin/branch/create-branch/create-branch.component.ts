import { BranchService } from './../../../../services/branch.service';
import { finalize, last, switchMap } from 'rxjs/operators';
import { element } from 'protractor';
import { ConfirmSnackbarComponent } from './../../../modals/confirm-snackbar/confirm-snackbar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';

// Import Interfaces
import { Branch } from 'src/app/interfaces/branch';
import { BranchAddress } from 'src/app/interfaces/branch-address';
import { AngularFireStorage } from '@angular/fire/storage';
import { BranchCombined } from 'src/app/interfaces/branch-combined';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})

export class CreateBranchComponent implements OnInit {

  // Initialize Spinner
  loadingMode: any;

  // Initializing interfaces
  branch: Branch;
  branchAddress: BranchAddress;

  // Initialize initial form group variables
  addBranchDetailsForm: FormGroup;
  addBranchAddressForm: FormGroup;

  // Data members and methods for file input
  selectedImage: File;
  downloadUrl: any;
  selectedImageUrl: any;

  // Data Members for input Restriction Handlers; 1.) Number Only Input
  value = '';
  counter = 0;

  // Data Member for Angular Material Stepper (Allows editable steps)
  isEditable = true;

  // Data Members for snackbar
  durationInSeconds = 5;

  // Data Members and Methods for Google Maps Places API
  address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  streetName: any; streetAddress: any; suburb: any; city: any; province: any; country: any; zip: any; // Displayed

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
    this.addBranchAddressForm.get('branchAddressFull')?.setValue(address.formatted_address);

    // Street number (Displayed i.t.o)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "street_number") {
          this.streetAddress = JSON.parse(JSON.stringify(address.address_components[i].long_name)) + " ";
        }
      }
    }

    // Street name (Displayed i.t.o)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "route") {
          this.streetAddress += JSON.parse(JSON.stringify(address.address_components[i].long_name));
        }
      }
    }

    // Set Street Name field to combined street name variable (this.streetAddress)
    this.addBranchAddressForm.get('branchStreetName')?.setValue(this.streetAddress);

    // Reset suburb on method refresh
    this.suburb = "";

    // Suburb (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "sublocality") {
          this.addBranchAddressForm.get('branchSuburb')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset city on method refresh
    this.city = "";

    // City (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "locality") {
          this.addBranchAddressForm.get('branchCity')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset province on method refresh
    this.province = "";

    // Province (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "administrative_area_level_1") {
          this.addBranchAddressForm.get('branchProvince')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset country on method refresh
    this.country = "";

    // Country (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "country") {
          this.addBranchAddressForm.get('branchCountry')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset zip on method refresh
    this.zip = "";

    // ZIP (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "postal_code") {
          this.addBranchAddressForm.get('branchZip')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Latitude Control (Not displayed)
    this.addBranchAddressForm.get('branchLate')?.setValue(this.latitude);

    // Longitude Control (Not displayed)
    this.addBranchAddressForm.get('branchLng')?.setValue(this.longitude);

  }

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private branchService: BranchService,
    private storage: AngularFireStorage,
    private route: Router
  ) { }

  ngOnInit(): void {
    // Initialization of branch details reactive form (Form 1 - Step 1)
    this.addBranchDetailsReactiveForm();
    // Initialization of branch Address reactive form (Form 2 - Step 2)
    this.addBranchAddressReactiveForm();
    // Initialize image list property for firebase image storage
    this.branchService.getImageDetailList();
  }

  // Form Group 1 - Branch Details (Step 1)
  addBranchDetailsReactiveForm() {
    this.addBranchDetailsForm = this.fb.group({
      // Branch Name Control
      branchName: ['',
        Validators.compose([Validators.required, Validators.maxLength(20)])
      ],
      // Branch Contact Number Control
      branchContactNumber: ['',
        Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)])
      ],
      // Branch Email Address Control
      branchEmailAddress: ['',
        Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      ],
      // Branch Image Control (Hidden)
      branchImage: []
    });
  }

  // Form Group 2 - Branch Address (Step 2)
  addBranchAddressReactiveForm() {
    this.addBranchAddressForm = this.fb.group({
      // Branch Address Control
      branchAddressFull: ['',
        Validators.compose([Validators.required])
      ],
      // Branch Street Name Control
      branchStreetName: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Branch Suburb Control
      branchSuburb: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Branch City Control
      branchCity: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Branch Province Control
      branchProvince: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Branch Country Control
      branchCountry: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Branch ZIP Control
      branchZip: [{ value: '', disabled: true },
      Validators.compose([Validators.required])
      ],
      // Branch Latitude Control (Hidden)
      branchLate: [{ value: '', disabled: true }],

      // Branch Longitude Control (Hidden)
      branchLng: [{ value: '', disabled: true }]
    });
  }

  // Submit and create new branch and branch address using branch service - on final confirm (Step 3)
  async onSubmit() {
    if (this.selectedImage) {
      this.loadingMode = 'query';
      const filePath = `POSImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedImage);
      task.snapshotChanges().pipe(
        last(),
        switchMap(() => fileRef.getDownloadURL())
      ).subscribe(url => {
        this.addBranchDetailsForm.get('branchImage')?.patchValue(url);
        if (this.addBranchDetailsForm.invalid || this.addBranchAddressForm.invalid) {
          return;
        }
        else {
          this.createBranch();
        }
      })
    } else {
      this.createBranch();
    }
  }

  // Subscribe to branch creation method in service and return response
  createBranch() {
    const branches: BranchCombined = {
      branch: this.addBranchDetailsForm.value,
      address: this.addBranchAddressForm.getRawValue()
    }

    console.log(branches);

    // Confirm New Branch Creation and Add New Branch
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm New Branch Addition',
        message: 'Are you sure you would like to confirm this addition?'
      }
    });
    this.loadingMode = 'determinate';
    confirm.afterClosed().subscribe(resp => {
      if (resp) {
        this.branchService.createBranch(branches).subscribe(o => {

          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              message: 'Branch created successfully!'
            }
          })

          success.afterClosed().subscribe(result => {
            console.log('Branch Added Successfully');
            this.route.navigateByUrl('/admin-home/maintain-branch');
            this.displaySuccessMessage("Branch Successfully Added!")
          });

        }, (error: HttpErrorResponse) => {
          console.log('Branch Not Added');
          if (error.status === 404) {
            this._snackBar.open('Creation of Branch Failed.', 'OK');

          }
          else if (error.status === 500 || error.status === 400) {
            this._snackBar.open('A branch with that name already exists!', 'OK');
          }
        }
        );
      }
    })
  }

  // Save Image to firebase DB Storage
  getImageFile(event: any) {
    this.selectedImage = event.target.files[0];
    let fileName = this.selectedImage.name;
    const element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.innerHTML = fileName;
  }

  // Error Handler (Used for conditional validation errors)
  public errorHandling = (control: string, error: string) => {
    return this.addBranchDetailsForm.controls[control].hasError(error);
  }

  // Input Restriction Handlers
  // 1.) Number Only Input (with reference to numbers-only directive)
  onChange(event: any) {
    this.value = event;
    this.counter = this.counter + 1;
    this.cd.detectChanges();
  }

  // Open Confirm Add New Branch Modal
  openDialog() {
    this.dialog.open(ConfirmModalComponent);
  }

  // Open Confirm Added Snackbar
  openSnackBar() {
    this._snackBar.openFromComponent(ConfirmSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
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
