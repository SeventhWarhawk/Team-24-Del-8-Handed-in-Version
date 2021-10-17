import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loyaltyDialogData } from 'src/app/interfaces/loyalty';

@Component({
  selector: 'app-voucher-qr-dialog',
  templateUrl: './voucher-qr-dialog.component.html',
  styleUrls: ['./voucher-qr-dialog.component.scss']
})
export class VoucherQrDialogComponent implements OnInit {

  voucherDetails: loyaltyDialogData;
  myAngularxQrCode: any;

  constructor(public dialogRef: MatDialogRef<VoucherQrDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: loyaltyDialogData) { }

  ngOnInit(): void {
    this.voucherDetails = this.data;
    this.myAngularxQrCode = this.voucherDetails.voucherCode;
  }

}
