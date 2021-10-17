import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoyaltyCustomer } from './../../../interfaces/loyalty';
import { LoyaltyService } from './../../../services/loyalty/loyalty.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatStepper } from '@angular/material/stepper';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-loyalty-member',
  templateUrl: './add-loyalty-member.component.html',
  styleUrls: ['./add-loyalty-member.component.scss']
})
export class AddLoyaltyMemberComponent implements OnInit {

  // Form Decleration
  searchForm!: FormGroup;
  dateForm!: FormGroup;
  todaysDate = new Date();

  // Loading Decleration
  loadingMode: any;

  // Table Decleration
  displayedColumns: string[] = ['customerId', 'customerName', 'customerSurname', 'customerTelephone', 'customerEmail', 'select'];
  public dataSource: MatTableDataSource<LoyaltyCustomer>;
  private dataArray: any;

  constructor(private fb: FormBuilder, private service: LoyaltyService, private snackBar: MatSnackBar, private dialog: MatDialog, private dialogRef: MatDialogRef<AddLoyaltyMemberComponent>) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: ['', Validators.required]
    });
    this.dateForm = this.fb.group({
      customerDob: ['', Validators.required]
    })
  }

  // Error Handler (Used for conditional validation errors)
  public errorHandling = (control: string, error: string) => {
    return this.dateForm.controls[control].hasError(error);
  }

  // Retrieve searched for customers' information
  criteria: any;
  customer: LoyaltyCustomer;

  // Passed Customer Parameters
  customerName: any;
  customerEmail: any;
  customerId: any;
  customerDob: any;
  useAdjustedName = false;

  // Get customer using search terms
  getSearchedCustomers(stepper: MatStepper) {
    this.loadingMode = 'query';
    this.criteria = this.searchForm.controls['searchInput'].value;
    this.service.getSearchedCustomers(this.criteria).subscribe(resp => {
      if (resp.length == 0) {
        this.displayErrorMessage('Customer does not exist. Please register the customer and try again')
        this.loadingMode = 'determinate';
      } else {
        for (let i = 0; i <= resp.length; i ++) {
          if (resp[i].isLoyaltyProgram == true) {
            this.displayErrorMessage('Customer is already registered as a loyalty member')
            this.loadingMode = 'determinate';
          } else {
            this.dataArray = resp;
            this.dataSource = new MatTableDataSource<LoyaltyCustomer>(this.dataArray);
            stepper.next();
            this.loadingMode = 'determinate';
          }
        }
      }
    }, err => {
      console.log("Error, no customer found")
    }
    )
  }

  // Select customer from table
  selectCustomer(name: any, email: any, id: any) {
    console.log(name)
    console.log(email)
    let newName = name.slice(-1);
    if (newName == 's') {
      this.useAdjustedName = false;
      this.customerName = name;
      this.customerEmail = email;
      this.customerId = id;
    } else {
      this.useAdjustedName = true;
      this.customerName = name;
      this.customerEmail = email;
      this.customerId = id;
    }
  }

  AddToLoyalty() {
    this.customerDob = this.dateForm.controls['customerDob'].value;
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm New Loyalty Member Addition',
        message: 'Are you sure you would like to add this customer as a loyalty member?'
      }
    });
    confirm.afterClosed().subscribe(resp => {
      this.loadingMode = 'query';
      if (resp) {
        const newLoyalty = {
          email: this.customerEmail,
          dob: this.customerDob,
          id: this.customerId
        }
        this.service.addToLoyalty(newLoyalty).subscribe(resp => {
          this.loadingMode = 'determinate';
          console.log("Customer added as loyalty member")
          this.displaySuccessMessage('Customer added as loyalty member')
          this.dialogRef.close();
        }, err => {
          console.log("Customer not added as loyalty member")
          this.loadingMode = 'determinate';
          this.displayErrorMessage('Unable to add customer as loyalty member')
        })
      }
    });
  }

  displayErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }

  displaySuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['success-snackbar']
    });
  }

}
