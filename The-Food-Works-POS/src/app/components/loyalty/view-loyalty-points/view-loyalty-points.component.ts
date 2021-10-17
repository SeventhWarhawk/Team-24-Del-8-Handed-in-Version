import { VoucherRedemptionsDialogComponent } from './voucher-redemptions-dialog/voucher-redemptions-dialog.component';
import { Observable } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { loyaltyDialogData, ViewedVoucher } from './../../../interfaces/loyalty';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoyaltyCustomer } from 'src/app/interfaces/loyalty';
import { MatTableDataSource } from '@angular/material/table';
import { MatStepper } from '@angular/material/stepper';
import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { AnyRecordWithTtl } from 'dns';
import { VoucherQrDialogComponent } from './voucher-qr-dialog/voucher-qr-dialog.component';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-view-loyalty-points',
  templateUrl: './view-loyalty-points.component.html',
  styleUrls: ['./view-loyalty-points.component.scss']
})
export class ViewLoyaltyPointsComponent implements OnInit {

  // Form Decleration
  searchForm!: FormGroup;
  dateForm!: FormGroup;
  searchTerm: any;

  // Loading Decleration
  loadingMode: any;

  // Table Decleration
  displayedColumns: string[] = ['customerId', 'customerName', 'customerSurname', 'customerTelephone', 'customerEmail', 'select'];
  public dataSource: MatTableDataSource<LoyaltyCustomer>;
  private dataArray: any;

  constructor(private fb: FormBuilder, private service: LoyaltyService, private snackBar: MatSnackBar, private dialog: MatDialog, private dialogRef: MatDialogRef<ViewLoyaltyPointsComponent>) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: ['', Validators.required],
    });
    this.dateForm = this.fb.group({
      dateInput: ['', Validators.required]
    })
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
    this.service.getSearchedCustomers(this.criteria).subscribe((resp: any) => {
      if (resp.length == 0) {
        this.displayErrorMessage('Customer does not exist. Please register the customer and try again')
        this.loadingMode = 'determinate';
      } else {
        for (let i = 0; i <= resp.length; i ++) {
          if (resp[i].isLoyaltyProgram == false) {
            this.displayErrorMessage('Customer is not a registered loyalty member')
            this.loadingMode = 'determinate';
          } else {
            this.dataArray = resp;
            this.dataSource = new MatTableDataSource<LoyaltyCustomer>(this.dataArray);
            stepper.next();
            this.loadingMode = 'determinate';
          }
        }
      }
    }, (err: any) => {
      console.log("Error, no customer found")
    }
    )
  }

  voucher: any = [];
  customerInfo: any = [];
  progress: any = [];
  newGenerationDate: any;
  voucherFlag: boolean;
  days: any;

  getProgressInformation(id: any) {
    this.service.getProgressInformation(id).subscribe((response: any) => {
      this.progress = response;
      let todaysDate = new Date();
      let newNowDate = formatDate(todaysDate, 'YYYY-MM-dd', 'en-US');
      console.log(newNowDate);
      var start = moment(newNowDate, "YYYY-MM-DD");
      var end = moment(this.progress[0].nextVoucherDate, "YYYY-MM-DD");

      var duration = moment.duration(end.diff(start));
      this.days = duration.asDays();
      console.log(this.progress)
    }, (error: any) => {
      console.log(error);
    })
  }

  getCustomerInformation(id: any) {
    this.service.getCustomerInformation(id).subscribe((response: any) => {
      this.customerInfo = response;
    }, (error: any) => {
      console.log(error);
    })
  }

  // Get Customers Voucher Information (Card 1)
  getVoucherInformation(id: any) {
    this.service.getVoucherInformation(id).subscribe((response: any) => {
      this.voucher = response;
      if (this.voucher.length == 0) {
        this.voucherFlag = true;
      } else {
        this.voucherFlag = false;
      }
      console.log(response);
    }, (error: any) => {
      console.log(error);
    })
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
    this.getVoucherInformation(id);
    this.getCustomerInformation(id);
    this.getProgressInformation(id);
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

  // Card One (Vouchers) --- /
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  // Card Two
  panelOpenState = false;

  // Display Voucher QR Code Dialog
  displayQrCode(code: any) {
    this.dialog.open(VoucherQrDialogComponent, {
      data: {voucherCode: code}
    });
  }

  // Display Voucher Redemptions Dialog
  displayRedemptions(id: any) {
    this.service.getRedemptions(id).subscribe((resp: any) => {
      this.dialog.open(VoucherRedemptionsDialogComponent, {
        data: resp,
        height: '500px'
      });
    })
  }

  // Unsubscribe Loyalty Member
  unsubscribe() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Unsubscribe',
        message: 'All customer loyalty records are kept. However, the customer will no longer earn loyalty points or receive vouchers'
      }
    });
    confirm.afterClosed().subscribe(resp => {
      if (resp) {
        this.service.unsubscribeMember(this.customerId).subscribe((resp: any) => {
          this.displaySuccessMessage('Successfully Unsubscribed Loyalty Member');
          this.dialogRef.close();
        }, (error: any) => {
          this.displayErrorMessage('Unable to unsubscribe loyalty member');
        })
      }
    });
  }

}
