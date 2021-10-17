import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPaymentDialog } from 'src/app/interfaces/payment';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

  counter: { min: number, sec: number };
  btnEnabled: boolean;
  btnTitle: any;

  paymentDetails: IPaymentDialog;
  paymentForm: FormGroup;
  confirmForm: FormGroup;
  cashAmount: any;
  cardAmount: any;
  timerStarted: boolean;
  checked = false;
  type: string;
  cashConvert: string;
  timerLength: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IPaymentDialog, public dialogRef: MatDialogRef<PaymentDialogComponent>,
              private fb: FormBuilder, private currency: CurrencyPipe) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardInput: ['', [
        Validators.required,
      ]],
      cashInput: ['', [ ]]
    });

    if (localStorage.getItem('paymentTimer') != null) {
      this.timerLength = localStorage.getItem('paymentTimer');
    } else {
      localStorage.setItem('paymentTimer', '30');
      this.timerLength = localStorage.getItem('paymentTimer');
    }
    this.cardAmount = 0;
    this.timerStarted = false;
    this.btnEnabled = true;
    this.btnTitle = `Wait (${this.timerLength}s)`;
    this.cashAmount = this.convertToCurrency(this.data.amount);
    this.cardAmount = this.convertToCurrency(this.cardAmount);
  }

  calculateCash() {
    this.cashAmount = this.data.amount;
    this.cardAmount = this.paymentForm.controls.cardInput.value;
    this.cashAmount -= this.cardAmount;
    this.cashAmount = this.convertToCurrency(this.cashAmount);

    if (!this.timerStarted) {
      this.startTimer();
      this.timerStarted = true;
    }
  }

  startTimer() {
    this.counter = { min: 0, sec: this.timerLength };
    const intervalId = setInterval(() => {
      if (this.counter.sec - 1 === -1) {
        this.counter.min -= 1;
        this.counter.sec = 59;
      } else {
        this.counter.sec -= 1;
        this.btnTitle = 'Wait (' + this.counter.sec + 's)';
      }
      if (this.counter.min === 0 && this.counter.sec === 0) {
        clearInterval(intervalId);
        this.btnTitle = 'Complete Sale';
        this.btnEnabled = false;
      }
    }, 1000);
  }

  completePayment() {
    if (this.cardAmount !== '0.00' && this.cashAmount !== '0.00') {
      this.type = 'Combination';
    } else if (this.cashAmount === '0.00') {
      this.type = 'Card';
    } else if (this.cardAmount === '0.00') {
      this.type = 'Cash';
    }

    this.paymentDetails = {
      paymentType: this.type,
      amount: this.data.amount
    };
    this.dialogRef.close(this.paymentDetails);
  }

  fixCardAmount() {
    console.log('hello');
    this.cardAmount = this.convertToCurrency(this.cardAmount);
  }

  convertToCurrency(amount: any) {
    return this.currency.transform(amount, 'ZAR', '', '1.2-2');
  }
}
