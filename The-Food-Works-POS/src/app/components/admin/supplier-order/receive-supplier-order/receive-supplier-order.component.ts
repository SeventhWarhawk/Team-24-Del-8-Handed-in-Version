import { CurrentOrder, orderLine } from './../../../../interfaces/supplierOrder';
import { SupplierOrderService } from './../../../../services/supplier-order.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupplierOrder } from 'src/app/interfaces/supplierOrder';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Content, Product } from 'src/app/interfaces/product';
import { AddProductQuantityComponent } from 'src/app/components/modals/add-product-quantity/add-product-quantity.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-receive-supplier-order',
  templateUrl: './receive-supplier-order.component.html',
  styleUrls: ['./receive-supplier-order.component.scss']
})
export class ReceiveSupplierOrderComponent implements OnInit {

  displayedColumns: string[] = ['productName', 'quantity' , 'addContent', 'removeContent'];
  dataSource = new MatTableDataSource<CurrentOrder>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ProductQuantityList: orderLine[] = [];
  oneProduct : orderLine = {
    ProductId : 0,
    SupplierOrderLineQuantity: 0,
  };

  quan:number;
  pid :number;

  selectedIngredients: any;

  ingredientsList: CurrentOrder[];
  check: CurrentOrder;


  constructor(private storage: AngularFireStorage, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ReceiveSupplierOrderComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: SupplierOrder, private formBuilder: FormBuilder, private SupplierOrderService : SupplierOrderService) { }

  form: FormGroup = new FormGroup({
    SupplierOrderId: new FormControl(null),
    InvoiceImage: new FormControl(null),
  });

  //open confirmation dialog
  openDialog() {
    if(this.ProductQuantityList.length > 0)
    {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          heading: 'Receive Order',
          message: 'Are you sure you want to receive this order?'
        }
      });
      confirm.afterClosed().subscribe(res => {
        if(res)
        {
          if(this.selectedImage == null)
          {
            this._snackBar.open('Please upload an invoice image!', 'OK');
          }
          else
          {
            const filePath = `InvoiceImages/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
            const fileRef = this.storage.ref(filePath);
            const task =  this.storage.upload(filePath, this.selectedImage);
            task.snapshotChanges().pipe(
            last(),
            switchMap(() => fileRef.getDownloadURL())
            ).subscribe(url => {
              console.log("THIS IS THE URL ", url);
              this.form.get('InvoiceImage')?.patchValue(url);
              if (this.form.invalid || this.form.invalid) {
                return;
              }
              else {
                this.updateSupplierOrder(this.form.value);
              }
            })
          }
        }
        else
        {
          console.log('BAD');
        }

      });
    }
    else
      this._snackBar.open('At least one item must be selected in order to receive this order!', 'OK');


  }

  ngOnInit(): void {
    this.form.patchValue({
      SupplierOrderId: this.data.SupplierOrderId,
    });

    this.SupplierOrderService.getCurrentIngredients(this.data.SupplierOrderId).subscribe(res=>
      {
        this.ingredientsList = res;
        console.log(this.ingredientsList);
        this.dataSource.data = this.ingredientsList;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return (
            data.productName!.toLowerCase().includes(filter)
          );
        };

        //add current products to a list which will be updated/added to
        this.ingredientsList.forEach((value,index)=>{
          this.check = value;
          if(this.check.quantity! > 0)
          {
            this.oneProduct =
            {
              ProductId : value.productId!,
              SupplierOrderLineQuantity : value.quantity!,
            };

            this.ProductQuantityList.push(this.oneProduct);
          }
        });

      })


  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  temp: orderLine;
    //add content
    updateContent(row: any) {
      console.log(row);
      console.log(row.quantity);

      if (row.quantity <= 0 || row.quantity == null || row.quantity == undefined || !Number.isInteger(row.quantity)) {
        this._snackBar.open('A Quantity must be entered and it may not be a decimal number, a negative number or 0', 'OK')._dismissAfter(3000);
      }
      else
      {
         console.log("This is Product Quantity List", this.ProductQuantityList);
         if(this.ProductQuantityList.length == 0 || this.ProductQuantityList == undefined || this.ProductQuantityList == null)
         {
          this._snackBar.open(row.productName+" was added to the received list of items", "OK")._dismissAfter(3000);
         }
         else
         {
          this.ProductQuantityList.forEach((value,index)=>{
            console.log("Value of Product Quantity List", value);
            this.temp = value;
            if(this.temp.ProductId === row.productId)
            {
              console.log("Temp", this.temp)
              this._snackBar.open("This item was added to the received list of items", "OK")._dismissAfter(3000);
              console.log("test snackbar", this.temp.SupplierOrderLineQuantity)
              this.ProductQuantityList.splice(index,1);
            }
            else
            {
              this._snackBar.open(row.productName+" was added to the received list of items", "OK")._dismissAfter(3000);
            }

           });
         }

        this.oneProduct = {
          ProductId : row.productId,
          SupplierOrderLineQuantity : row.quantity,
        };

        this.ProductQuantityList.push(this.oneProduct);
      }
    }

    //remove content
    removeContent(row: any)
    {
      console.log("Testing row to delete", row);

      this.ProductQuantityList.forEach((value,index)=>{
        console.log("Value of Product Quantity List before deleting", value);
        this.temp = value;
        if(this.temp.ProductId === row.productId)
        {
          console.log("This Temp - delete", this.temp);
          this._snackBar.open(row.productName +" has been removed from the received list of items", "OK")._dismissAfter(5000);
          console.log("This index - delete", index)
          this.ProductQuantityList.splice(index,1);
          row.quantity = "";
        }
       });
    }


   // Save Image to firebase DB Storage
   selectedImage: File;

   getImageFile(event: any) {
     this.selectedImage = event.target.files[0];
     let fileName = this.selectedImage.name;
     const element: HTMLElement = document.getElementById('file') as HTMLElement;
     element.innerHTML = fileName;
   }

  toUpdateOrder: SupplierOrder;

  updateSupplierOrder(formValue : any)
  {
      this.toUpdateOrder ={
        SupplierOrderId : formValue.SupplierOrderId,
        InvoiceImage : formValue.InvoiceImage,
        orderLines : this.ProductQuantityList,
        }

      console.log(this.toUpdateOrder);

      this.SupplierOrderService.updateSupplierOrder(this.toUpdateOrder).subscribe(res =>{
        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Order Successfully Received',
            message: 'This order was successfully received!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.dialogRef.close();
            window.location.reload();

          });
      }
      )
  }

  onCancel()
  {
    this.dialogRef.close();
  }
}
