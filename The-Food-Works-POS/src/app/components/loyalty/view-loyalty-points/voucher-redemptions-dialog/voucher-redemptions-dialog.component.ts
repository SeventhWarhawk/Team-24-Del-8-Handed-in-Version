import { loyaltyDialogData } from './../../../../interfaces/loyalty';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-voucher-redemptions-dialog',
  templateUrl: './voucher-redemptions-dialog.component.html',
  styleUrls: ['./voucher-redemptions-dialog.component.scss']
})
export class VoucherRedemptionsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VoucherRedemptionsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: loyaltyDialogData) { }

  displayedColumns: string[] = ['id', 'number', 'amount', 'date'];
  dataSource: any;
  code: any;

  ngOnInit(): void {
    console.log(this.data.voucherCode);
    this.dataSource = this.data;
    this.code = this.data.voucherCode;
  }

}
