import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IOrderItems } from 'src/app/interfaces/customerOrder';
import { CustomerOrderService } from 'src/app/services/customer-order.service';

@Component({
  selector: 'app-pack-order-dialog',
  templateUrl: './pack-order-dialog.component.html',
  styleUrls: ['./pack-order-dialog.component.scss']
})
export class PackOrderDialogComponent implements OnInit {

  @ViewChild('barcode') barcode: ElementRef;
  totalItems: number;
  orderItems: IOrderItems[];
  isLoading: boolean;
  saleID: number;
  barcodeInput: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IOrderItems[], private snackBar: MatSnackBar, private service: CustomerOrderService,
              private dialogRef: MatDialogRef<PackOrderDialogComponent>) { }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data.forEach(element => {
      this.totalItems += element.quantity;
    });

    this.orderItems = this.data;
    this.isLoading = false;
    this.saleID = this.orderItems[0].saleID;
  }

  captureBarcode(barcode: any) {
    const index = this.orderItems.findIndex(zz => zz.barcode === barcode);
    if (index !== -1) {
      if (this.orderItems[index].quantity !== 0) {
        this.orderItems[index].quantity -= 1;
        this.totalItems -= 1;
        if (this.orderItems[index].quantity === 0) {
          this.orderItems[index].packed = true;
          if (this.totalItems === 0) {
            this.isLoading = true;
            this.service.packOrder(this.saleID).subscribe(res => {
              this.isLoading = false;
              this.dialogRef.close(true);
            }, error => {
              this.displayErrorMessage('Oops! Something went wrong.');
            });
          }
        }
      } else {
        this.displayErrorMessage('Product(s) has already been packed!');
      }
    } else {
      this.displayErrorMessage('Product does not exist in order!');
    }
    this.barcodeInput = '';
  }

  onBlur() {
    setTimeout(() => this.barcode.nativeElement.focus(), 0);
  }

  displayErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }
}
