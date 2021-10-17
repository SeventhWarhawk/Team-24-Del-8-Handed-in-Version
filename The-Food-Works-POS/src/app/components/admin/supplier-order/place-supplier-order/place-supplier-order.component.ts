import { orderLine } from './../../../../interfaces/supplierOrder';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddProductQuantityComponent } from 'src/app/components/modals/add-product-quantity/add-product-quantity.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Content, Product } from 'src/app/interfaces/product';
import { SupplierOrder } from 'src/app/interfaces/supplierOrder';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';




@Component({
  selector: 'app-place-supplier-order',
  templateUrl: './place-supplier-order.component.html',
  styleUrls: ['./place-supplier-order.component.scss']
})
export class PlaceSupplierOrderComponent implements OnInit {

  created = false;
  constructor(private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<PlaceSupplierOrderComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: SupplierOrder, private formBuilder: FormBuilder, private SupplierOrderService: SupplierOrderService) { }

  displayedColumns: string[] = ['productName', 'quantity', 'addContent', 'removeContent'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ProductQuantityList: orderLine[] = [];
  oneProduct: orderLine = {
    ProductId: 0,
    SupplierOrderLineQuantity: 0,
  };

  quan: number;
  pid: number;

  selectedIngredients: any;

  ingredientList: Product[];



  form: FormGroup = new FormGroup({
    SupplierVatNumber: new FormControl(null),
    SupplierName: new FormControl(""),
    SupplierOrderId: new FormControl(null),
  });


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //open confirmation dialog
  openDialog() {
    if (this.ProductQuantityList.length > 0) {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          heading: 'Place Order',
          message: 'Are you sure you want to place this order?'
        }
      });
      confirm.afterClosed().subscribe(res => {
        if (res) {
          console.log('Placed Successfully');
          this.placeSupplierOrder(this.form.value);
        }
        else {
          console.log('BAD');
        }

      });
    }
    else
      this._snackBar.open('At least one ingredient item must be selected for this order!', 'OK');
  }

  ngOnInit(): void {
    this.form.patchValue({
      SupplierName: this.data.SupplierName,
      SupplierVatNumber: this.data.SupplierVatNumber
    });

    this.SupplierOrderService.getIngredients().subscribe(res => {
      this.ingredientList = res;
      this.dataSource.data = res;
      console.log(this.ingredientList);
      this.created = true;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (
          data.ProductName.toLowerCase().includes(filter)
        );
      };
    })
  }

  temp: orderLine;

  toPlaceOrder: SupplierOrder;

  placeSupplierOrder(formValue: any) {
    this.toPlaceOrder = {
      SupplierOrderId: 0,
      SupplierVatNumber: formValue.SupplierVatNumber,
      orderLines: this.ProductQuantityList,
    }

    console.log(this.toPlaceOrder);

    this.SupplierOrderService.placeSupplierOrder(this.toPlaceOrder).subscribe(res => {
      console.log(res);
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: true,
        data: {
          heading: 'Order Successfully Placed',
          message: 'This order was successfully placed!'
        }
      })

      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();
        //window.location.reload();

        this.SupplierOrderService.placeSupplierOrderEmail(this.toPlaceOrder).subscribe(res => {
          console.log(res);
        })

      });
    },
      (error: HttpErrorResponse) => {
        console.log("ERROR RESPONSE WORKS")
        if (error.status === 400) {
          console.log("ERROR")
          this._snackBar.open('At least one ingredient item must be selected for this order!', 'OK');
        }
      }
    )
  }

  onCancel() {
    this.dialogRef.close();
  }


  addContent(row: any) {
    console.log(row);
    console.log(row.Quantity);

    if (row.Quantity <= 0 || row.Quantity == null || row.Quantity == undefined || !Number.isInteger(row.Quantity)) {
      this._snackBar.open('A Quantity must be entered and it may not be a decimal number, a negative number or 0', 'OK')._dismissAfter(3000);
    }
    else {
      console.log("This is Product Quantity List", this.ProductQuantityList);
      if (this.ProductQuantityList.length == 0 || this.ProductQuantityList == undefined || this.ProductQuantityList == null) {
        this._snackBar.open(row.ProductName + " was added to this supplier order!", "OK")._dismissAfter(3000);
      }
      else {
        this.ProductQuantityList.forEach((value, index) => {
          console.log("Value of Product Quantity List", value);
          this.temp = value;
          if (this.temp.ProductId != row.ProductId) {
            this._snackBar.open(row.ProductName + " was added to this supplier order!", "OK")._dismissAfter(3000);
          }

        });

        this.ProductQuantityList.forEach((value, index) => {
          console.log("Value of Product Quantity List", value);
          this.temp = value;
          if (this.temp.ProductId === row.ProductId) {
            console.log("Temp", this.temp)
            this._snackBar.open("This item's quantity has been updated from " + this.temp.SupplierOrderLineQuantity + " to " + row.Quantity, "OK")._dismissAfter(3000);
            console.log("test snackbar", this.temp.SupplierOrderLineQuantity)
            this.ProductQuantityList.splice(index, 1);
          }
        });
      }

      this.oneProduct =
      {
        ProductId: row.ProductId,
        SupplierOrderLineQuantity: row.Quantity,
      };

      this.ProductQuantityList.push(this.oneProduct);
    }
  }

  removeContent(row: any) {
    console.log("Testing row to delete", row);

    if (this.ProductQuantityList.length == 0) {
      console.log("1")
      this._snackBar.open("This item does not exist in the supplier order. Therefore, it cannot be removed!", "OK")._dismissAfter(3000);
      row.Quantity = "";
    }
    else {
      this.ProductQuantityList.forEach((value, index) => {
        console.log("Value of Product Quantity List before deleting", value);
        this.temp = value;
        if (this.temp.ProductId != row.ProductId) {
          console.log("3")
          this._snackBar.open("This item does not exist in the supplier order. Therefore, it cannot be removed!", "OK")._dismissAfter(3000);
          row.Quantity = "";
        }
      });

      this.ProductQuantityList.forEach((value, index) => {
        console.log("Value of Product Quantity List before deleting", value);
        this.temp = value;
        if (this.temp.ProductId === row.ProductId) {
          console.log("2")
          this._snackBar.open(row.ProductName + " has been removed from the supplier order", "OK")._dismissAfter(3000);
          console.log("This index - delete", index)
          this.ProductQuantityList.splice(index, 1);
          row.Quantity = "";
        }
      });
    }

  }

}
