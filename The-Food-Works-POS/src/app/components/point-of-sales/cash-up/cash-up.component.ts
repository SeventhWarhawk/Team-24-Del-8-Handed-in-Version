import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  cash: string;
  card: string;
  voucher: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {cash: '1000', card: '0', voucher: '0'},
  {cash: '120', card: '50', voucher: '0'},
  {cash: '0', card: '525', voucher: '1255'},
  {cash: '0', card: '320', voucher: '0'},
];


@Component({
  selector: 'app-cash-up',
  templateUrl: './cash-up.component.html',
  styleUrls: ['./cash-up.component.scss']
})
export class CashUpComponent implements OnInit {


  constructor() { }

  form: FormGroup = new FormGroup({
    formID: new FormControl(null),
    float: new FormControl("", Validators.required),
    cashInDrawer: new FormControl("", Validators.required),
    cardAmount:new FormControl("", Validators.required),
    voucherAmount: new FormControl("", Validators.email),

    });

    displayedColumns: string[] = ['cash', 'card', 'voucher'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

  ngOnInit(): void {
  }

}
