import { LoyaltyCustomer } from 'src/app/interfaces/loyalty';
import { Voucher } from './../../../interfaces/loyalty';
import { MatStepper } from '@angular/material/stepper';
import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPaymentDialog } from 'src/app/interfaces/payment';
import { Customer } from 'src/app/interfaces/customer';
import { DatePipe, formatDate } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-redeem-voucher',
  templateUrl: './redeem-voucher.component.html',
  styleUrls: ['./redeem-voucher.component.scss']
})
export class RedeemVoucherComponent implements OnInit {

  // Form Declerations
  searchForm!: FormGroup;

  // Loading Decleration
  loadingMode: any;
  datePipe: any;

  constructor(private fb: FormBuilder, private service: LoyaltyService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: IPaymentDialog, public dialogRef: MatDialogRef<RedeemVoucherComponent>) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: [''],
    });
    this.paymentDetails = this.data;
    this.canPay = false;
  }

  code: any;
  voucher: Voucher;
  customer: LoyaltyCustomer;
  voucherAmount: any;
  paymentDetails: IPaymentDialog;
  customerFullName: any;
  canPay: boolean;
  afterVoucherAmount: any;
  remainingVoucherAmount: any;
  voucherExpirationDate: any;
  days: any;

  getSearchedVoucher(event: any, stepper: MatStepper) {
    let code = event.target.value;
    let length = code.length;
    if (length == 7) {
      this.loadingMode = 'query';
    } else {
      this.loadingMode = 'determinate';
    }
    this.service.getSearchedVoucher(code).subscribe(resp => {

      this.voucher = resp;
      this.voucherAmount = this.voucher.voucherAmount;
      this.customerFullName = this.voucher.customer.customerName + " " + this.voucher.customer.customerSurname;

      // Format Expiration Date (And Get Number of days between today and expiration Date)
      const datepipe: DatePipe = new DatePipe('en-US')
      this.voucherExpirationDate = datepipe.transform(this.voucher.voucherExpiryDate, 'dd-MMM-yyyy');
      let todaysDate = new Date();
      let newNowDate = formatDate(todaysDate, 'YYYY-MM-dd', 'en-US');
      console.log(newNowDate);
      let newExpDate = formatDate(this.voucherExpirationDate, 'YYYY-MM-dd', 'en-US');
      console.log(newExpDate);
      var start = moment(newNowDate, "YYYY-MM-DD");
      var end = moment(newExpDate, "YYYY-MM-DD");

      var duration = moment.duration(end.diff(start));
      this.days = duration.asDays();

      const arr = this.customerFullName.split(" ");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      this.customerFullName = arr.join(" ");

      // Get After Voucher Amount
      this.afterVoucherAmount = this.paymentDetails.amount - this.voucherAmount;
      if (this.afterVoucherAmount <= 0) {
        this.canPay = true;
        this.remainingVoucherAmount = Math.abs(this.afterVoucherAmount);
        this.afterVoucherAmount = 0;
      } else {
        this.remainingVoucherAmount = 0;
      }

      if (this.voucher.voucherStatus == true && this.voucher.voucherAmount > 0) {
        this.loadingMode = 'determinate';
        stepper.next();
        this.code = this.voucher.voucherCode;
      } else if (this.voucher.voucherStatus == false) {
        this.loadingMode = 'determinate';
        this.displayErrorMessage('Voucher has expired')
      } else if (this.voucher.voucherAmount <= 0) {
        this.loadingMode = 'determinate';
        this.displayErrorMessage('Voucher has been fully used up')
      }

      console.log(resp);

    }, err => {
      console.log("No Voucher Found");
    });
  }

  onConfirm() {
    const appliedVoucher = {
      amount: this.voucherAmount,
      newAmount: this.voucherAmount - (this.voucherAmount - this.remainingVoucherAmount),
      instanceAmount: this.voucherAmount - this.remainingVoucherAmount,
      id: this.voucher.voucherId,
      code: this.voucher.voucherCode,
      afterAmount: this.afterVoucherAmount
    }
    this.dialogRef.close(appliedVoucher);
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

  clearForm() {
    this.searchForm.reset();
  }
}
