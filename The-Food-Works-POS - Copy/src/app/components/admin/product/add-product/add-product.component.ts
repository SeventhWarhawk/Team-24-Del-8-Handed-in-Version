import { AddProductQuantityComponent } from './../../../modals/add-product-quantity/add-product-quantity.component';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ThemePalette } from '@angular/material/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Content, Product, ProductTypes } from 'src/app/interfaces/product';
import { ProductService } from './../../../../services/product.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { last, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
//import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  typesData: ProductTypes[];
  observeTypes: Observable<ProductTypes[]> = this.ProductService.getproductTypes();
  selectedOption : number;
  TypeIDSend : number = 0;
  Products: any;
  contentList : Product[];
  selectedContents: any;
  isIngredient : boolean = false;
  quantity: any = [];
  holder: any = "0"
  productToWrite:Product;

  ProductQuantityList: Content[] = [];
  oneProduct : Content = {
    ProductId : 0,
    Quantity: 0,
  };
  //ingredients:any;

  ProductImage: any;
  imagePath: any;

  displayedColumns: string[] = ['productName', 'quantity', 'addContent', 'removeContent'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private storage: AngularFireStorage, private ProductService : ProductService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  form: FormGroup = new FormGroup({
    ProductName: new FormControl("", [Validators.required, Validators.maxLength(30)]),
    ProductDescription: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    ProductBarcode: new FormControl("", Validators.minLength(6)),
    ProductImage : new FormControl(""),
    });


  ngOnInit(): void {
    this.observeTypes.subscribe(data => {
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



 temp: Content;

  getProducts(selected:number)
  {
    this.TypeIDSend = selected;
    if(selected != 3 && selected != 2)
    {
      this.ProductService.getIngredients().subscribe(res=>
        {
          this.contentList = res;
          this.isIngredient = false;
          this.dataSource.data = this.contentList;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return (
              data.ProductName.toLowerCase().includes(filter)
            );
          };
        })
    }
    else if(selected == 3)
    {
      this.ProductService.getAllProducts().subscribe(res=>
        {
          this.contentList = res;
          this.isIngredient = false;
          console.log(this.contentList);
          this.dataSource.data = this.contentList;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return (
              data.ProductName.toLowerCase().includes(filter)
            );
          };
          this.holder = "0";
        })
    }
    else if(selected == 2)
    {
      this.isIngredient = true;
      //this.form.reset();
    }
  }


  // Save Image to firebase DB Storage
  selectedImage: File;

  getImageFile(event: any) {
    this.selectedImage = event.target.files[0];
    let fileName = this.selectedImage.name;
    const element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.innerHTML = fileName;

    const files = event.target.files;
    if (files.length === 0)
        return;

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
        this.ProductImage = reader.result;
    }
  }


  onCancel()
  {
    this.form.reset();
  }


  addThis(f:any)
  {
    this.productToWrite ={
    ProductTypeId : this.TypeIDSend,
    ProductName : f.ProductName,
    ProductDescription : f.ProductDescription,
    ProductBarcode : f.ProductBarcode,
    ProductImage : f.ProductImage,
    contents : this.ProductQuantityList,
    }
    console.log(this.productToWrite)

    if(this.TypeIDSend == 0)
    {
      this._snackBar.open('Please select a product type!', 'OK');
    }
    else if(this.TypeIDSend != 2 && this.ProductQuantityList.length == 0)
    {
      this._snackBar.open('At least one content item must be selected for this product!', 'OK');
    }
    else
    {
      this.ProductService.addProduct(this.productToWrite).subscribe(res => {

        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Product Successfully Added',
            message: 'This product has been successfully added!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.dialogRef.close();
            //window.location.reload();

          });
      },
      (error: HttpErrorResponse) => {
        console.log("ERROR RESPONSE WORKS")
        if (error.status === 400) {
          console.log("ERROR")
          this._snackBar.open('This product already exists in the database!', 'OK');
        }
      }
    )
    }
}


addContent(row: any) {
  console.log(row);
  console.log(row.Quantity);

  if(row.Quantity <= 0 || row.Quantity == null || row.Quantity == undefined)
  {
    this._snackBar.open('A quantity must be entered and it may not be a negative number or 0', 'OK');
  }
  else
  {
     console.log("This is Product Quantity List", this.ProductQuantityList);
     if(this.ProductQuantityList.length == 0 || this.ProductQuantityList == undefined || this.ProductQuantityList == null)
     {
      this._snackBar.open(row.ProductName+" was added to this product's contents!", "OK")._dismissAfter(3000);
     }
     else
     {
      this.ProductQuantityList.forEach((value,index)=>{
        console.log("Value of Product Quantity List", value);
        this.temp = value;
        if(this.temp.ProductId === row.ProductId)
        {
          console.log("Temp", this.temp)
          this._snackBar.open("This item's quantity has been updated from "+ this.temp.Quantity + " to " + row.Quantity, "OK")._dismissAfter(3000);
          console.log("test snackbar", this.temp.Quantity)
          this.ProductQuantityList.splice(index,1);
        }
        else
        {
          this._snackBar.open(row.ProductName+" was added to this product's contents!", "OK")._dismissAfter(3000);
        }

       });
     }

    this.oneProduct = {
      ProductId : row.ProductId,
      Quantity : row.Quantity,
    };

    this.ProductQuantityList.push(this.oneProduct);
  }
}

removeContent(row: any)
{
  console.log("Testing row to delete", row);

  if(row.Quantity <= 0 || row.Quantity == undefined || row.Quantity == null)
  {
    this._snackBar.open("No entered quantity exists for this item!", "OK")._dismissAfter(3000);
  }
  else
  {
    this.ProductQuantityList.forEach((value,index)=>{
      console.log("Value of Product Quantity List before deleting", value);
      this.temp = value;
      if(this.temp.ProductId === row.ProductId)
      {
        console.log("This Temp - delete", this.temp);
        this._snackBar.open(row.ProductName +" has been removed from the product's content", "OK")._dismissAfter(3000);
        console.log("This index - delete", index)
        this.ProductQuantityList.splice(index,1);
        row.Quantity = "";
      }
     });
  }

}

openDialog() {
  const confirm = this.dialog.open(ConfirmModalComponent, {
    disableClose: true,
    data: {
      heading: 'Confirm Product Addition',
      message: 'Are you sure you would like to confirm this addition?'
    }
  });
  confirm.afterClosed().subscribe(res => {
    if(res)
    {
      console.log('Added Successfully');
      console.log(this.selectedImage)

      if(this.TypeIDSend == 2)
      {
        this.addThis(this.form.value);
      }
      else if(this.TypeIDSend != 2 && this.selectedImage == null)
      {
        this._snackBar.open('Please select an image for this product!', 'OK');
      }
      else{
        const filePath = `ProductImages/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        const task =  this.storage.upload(filePath, this.selectedImage);
        task.snapshotChanges().pipe(
        last(),
        switchMap(() => fileRef.getDownloadURL())
        ).subscribe(url => {
          console.log("THIS IS THE URL ", url);
          this.form.get('ProductImage')?.patchValue(url);
          if (this.form.invalid || this.form.invalid) {
            return;
          }
          else {
            this.addThis(this.form.value);
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

}
