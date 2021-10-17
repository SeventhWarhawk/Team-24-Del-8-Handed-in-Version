import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';
import { Component, Input, OnInit } from '@angular/core';
import { Customer } from 'src/app/interfaces/customer';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-attach-customer-dialog',
  templateUrl: './attach-customer-dialog.component.html',
  styleUrls: ['./attach-customer-dialog.component.scss']
})
export class AttachCustomerDialogComponent implements OnInit {
  term: any;
  customer: Customer[];

  constructor(private service: LoyaltyService, public dialogRef: MatDialogRef<AttachCustomerDialogComponent>) { }

  ngOnInit(): void {
    this.service.getAllCustomers().subscribe((resp: any) => {
      console.log(resp);
      this.customer = resp;
    }, (error: any) => {
      console.log("Unable to get customers")
    })
  }

  unattach() {
    let data = {
      customerId: null,
      customerName: null,
      customerSurname: null,
      customerEmail: null
    };
    this.dialogRef.close(data);
  }

  captureData(id: any, name: any, surname: any, email: any) {
    let data = {
      customerId: id,
      customerName: name,
      customerSurname: surname,
      customerEmail: email
    };
    this.dialogRef.close(data);
  }


}
