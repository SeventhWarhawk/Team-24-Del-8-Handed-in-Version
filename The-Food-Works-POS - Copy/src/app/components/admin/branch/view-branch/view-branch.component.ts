import { BranchUpdate } from './../../../../interfaces/branch';
import { BranchCombined } from 'src/app/interfaces/branch-combined';
import { HttpErrorResponse } from '@angular/common/http';
import { BranchService } from './../../../../services/branch.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchForm } from 'src/app/interfaces/branch';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.scss']
})
export class ViewBranchComponent implements OnInit {

  // View / Update Form of Branch Viewed / Updated
  viewBranchForm1: FormGroup;

  // Initialization of view branch container variable
  branchInfo: BranchForm[];
  updatedBranch: any = [];
  branchImage: any;
  selectedImage: any;
  status: any;
  name: any;
  loadingMode: any;

  // Data Members and Methods for Google Maps Places API
  address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  streetName: any; streetAddress: any; suburb: any; city: any; province: any; country: any; zip: any; // Displayed

  addressOptions = {
    componentRestrictions: { country: "za" },
    types: ["address"]
  } as Options;
  storage: any;

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
    this.viewBranchForm1.get('branchAddressFull')?.setValue(address.formatted_address);

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
    this.viewBranchForm1.get('branchStreetName')?.setValue(this.streetAddress);

    // Reset suburb on method refresh
    this.suburb = "";

    // Suburb (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "sublocality") {
          this.viewBranchForm1.get('branchSuburb')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset city on method refresh
    this.city = "";

    // City (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "locality") {
          this.viewBranchForm1.get('branchCity')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset province on method refresh
    this.province = "";

    // Province (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "administrative_area_level_1") {
          this.viewBranchForm1.get('branchProvince')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset country on method refresh
    this.country = "";

    // Country (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "country") {
          this.viewBranchForm1.get('branchCountry')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Reset zip on method refresh
    this.zip = "";

    // ZIP (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "postal_code") {
          this.viewBranchForm1.get('branchZip')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Latitude Control (Not displayed)
    this.viewBranchForm1.get('branchLate')?.setValue(this.latitude);

    // Longitude Control (Not displayed)
    this.viewBranchForm1.get('branchLng')?.setValue(this.longitude);
  }

  constructor(
    private fb: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private branchService: BranchService,
    private storageFb: AngularFireStorage,
    public dialog: MatDialog,
    private route: Router,
    private _snackBar: MatSnackBar,
  ) {}

  // Fetch ID number from URL (Branch ID Number of branch selected)
  passedId = this._Activatedroute.snapshot.paramMap.get("id");

  ngOnInit(): void {
    this.loadingMode = 'query';

    this.branchService.getAllBranchData(this.passedId).subscribe(
      (data: any) => {
        this.loadingMode = 'determinate';
        this.branchInfo = data;
        this.branchImage = this.branchInfo[0].BranchImage;
        this.status = this.branchInfo[0].BranchStatus;
        this.name = this.branchInfo[0].BranchName;
        console.log(data);
        // Populate View Branch Form Group
        this.viewBranchForm1 = this.fb.group({
          branchStatus: [this.branchInfo[0].BranchStatus],
          // Branch Name Control
          branchName: [this.branchInfo[0].BranchName,
            Validators.compose([Validators.required])
          ],
          // Branch Contact Number Control
          branchContactNumber: [this.branchInfo[0].BranchContactNumber,
            Validators.compose([Validators.required])
          ],
          // Branch Email Address Control
          branchEmailAddress: [this.branchInfo[0].BranchEmailAddress,
            Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
          ],
          // Branch Image Control
          branchImage: [this.branchInfo[0].BranchImage,
            Validators.compose([Validators.required])
          ],
          // Branch Main Address Control (Autocomplete)
          branchAddressFull: [this.branchInfo[0].BranchAddressFull,
            Validators.compose([Validators.required])
          ],
          // Branch Street Name Control
          branchStreetName: [{value: this.branchInfo[0].BranchStreetAddress, disabled: true},
            Validators.compose([Validators.required])
          ],
          // Branch Suburb Control
          branchSuburb: [{value: this.branchInfo[0].BranchSuburb, disabled: true},
            Validators.compose([Validators.required])
          ],
          // Branch City Control
          branchCity: [{value: this.branchInfo[0].BranchCity, disabled: true},
            Validators.compose([Validators.required])
          ],
          // Branch Province Control
          branchProvince: [{value: this.branchInfo[0].BranchProvince, disabled: true},
            Validators.compose([Validators.required])
          ],
          // Branch Country Control
          branchCountry: [{value: this.branchInfo[0].BranchCountry, disabled: true},
            Validators.compose([Validators.required])
          ],
          // Branch ZIP Control
          branchZip: [{value: this.branchInfo[0].BranchZip, disabled: true},
            Validators.compose([Validators.required])
          ],
          // Branch Latitude Control (Hidden)
          branchLate: [{value: this.branchInfo[0].BranchLate, disabled: true}],

          // Branch Longitude Control (Hidden)
          branchLng: [{value: this.branchInfo[0].BranchLng, disabled: true}],

        });
      (error: HttpErrorResponse) => {
        console.log(error);
      }}
    )
  }

  async onSubmit() {
    if (this.selectedImage != null) {
      const filePath = `POSImages/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storageFb.ref(filePath);
      const task =  this.storageFb.upload(filePath, this.selectedImage);
      task.snapshotChanges().pipe(
        last(),
        switchMap(() => fileRef.getDownloadURL())
        ).subscribe((url: any) => {
          this.viewBranchForm1.get('branchImage')?.patchValue(url);
          if (this.viewBranchForm1.invalid) {
            return;
          }
          else {
            this.updateBranch();
          }
        })
    } else {
      this.updateBranch();
    }
  }

  updateBranch() {
    // Confirm New Branch Creation and Add New Branch
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Branch Updates',
        message: 'Are you sure you would like to update this branch?'
      }
    });
    confirm.afterClosed().subscribe(resp => {
      this.loadingMode = 'query';
      if (resp) {
        const newBranch: BranchUpdate = this.viewBranchForm1.getRawValue();
        this.branchService.updateBranch(newBranch, this.passedId).subscribe(
        (resp: any) => {
          console.log("Branch Updated Successfully")
          this.route.navigateByUrl('/admin-home/maintain-branch');
          this.displaySuccessMessage("Branch Successfully Updated!")
          this.loadingMode = 'determinate';
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.displayErrorMessage("Unable to Update Branch!")
          }
          else if (error.status === 500 || error.status === 400) {
            this.displayErrorMessage("A branch with that name already exists!")
          } else {
            this.displayErrorMessage("An error occured on the server side!")
          }
          this.loadingMode = 'determinate';
        });
      }
    })
  }

  // Method to reset form to initial values (Discard Changes On Click)
  resetDefault() {
    this.viewBranchForm1.patchValue({
      // Branch Details Section
      branchStatus: this.branchInfo[0].BranchStatus,
      branchName: this.branchInfo[0].BranchName,
      branchContactNumber: this.branchInfo[0].BranchContactNumber,
      branchEmailAddress: this.branchInfo[0].BranchEmailAddress,
      branchImage: this.branchInfo[0].BranchImage,
      // Branch Address Section
      branchAddressFull: this.branchInfo[0].BranchAddressFull,
      branchStreetName: this.branchInfo[0].BranchStreetAddress,
      branchSuburb: this.branchInfo[0].BranchSuburb,
      branchCity: this.branchInfo[0].BranchCity,
      branchProvince: this.branchInfo[0].BranchProvince,
      branchCountry: this.branchInfo[0].BranchCountry,
      branchZip: this.branchInfo[0].BranchZip,
      branchLate: this.branchInfo[0].BranchLate,
      branchLng: this.branchInfo[0].BranchLng
    })
    this.viewBranchForm1.markAsPristine();
  }

  imagePath: any;
  url: any;

  getImageFile(event: any) {
    this.selectedImage = event.target.files[0];
    let fileName = this.selectedImage.name;
    const element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.innerHTML = fileName;

    const files = event.target.files;
    if (files.length === 0)
        return;

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
        this.branchImage = reader.result;
    }
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
