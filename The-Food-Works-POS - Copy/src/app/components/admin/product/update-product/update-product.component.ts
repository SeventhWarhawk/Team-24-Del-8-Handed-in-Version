import { Content, Product, ProductStatuses, Current } from './../../../../interfaces/product';
import { ProductService } from './../../../../services/product.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductTypes } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddProductQuantityComponent } from 'src/app/components/modals/add-product-quantity/add-product-quantity.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireStorage } from '@angular/fire/storage';
import { last, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {

  displayedColumns: string[] = ['productName', 'quantity' , 'addContent', 'removeContent'];
  dataSource = new MatTableDataSource<Current>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private storage: AngularFireStorage, private _snackBar: MatSnackBar, private ProductService: ProductService, public dialogRef: MatDialogRef<UpdateProductComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Product, private formBuilder: FormBuilder) { }

  typesData: ProductTypes[];
  observeTypes: Observable<ProductTypes[]> = this.ProductService.getproductTypes();
  statusesData: ProductStatuses[];
  observeStatuses: Observable<ProductStatuses[]> = this.ProductService.getproductStatuses();

  selectedOption = this.data.ProductTypeId;
  selectedStatOption = this.data.ProductStatusId;
  StatusIDSend: number;
  TypeIDSend : number;
  Products: any;
  contentList : Product[];
  ingredientsList: Current[];
  packageProductsList: Current[];
  selectedContents: any;
  //= this.data.ProductNames;
  isIngredient : boolean = false;

  conList : any;
  obj: any;

  productToWrite:Product;

  ProductQuantityList: Content[] = [];
  oneProduct : Content = {
    ProductId : 0,
    Quantity: 0,
  };

  check: Current;


  form: FormGroup = new FormGroup({
    ProductName: new FormControl("", [Validators.required, Validators.maxLength(30)]),
    ProductDescription: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    ProductBarcode: new FormControl("", Validators.minLength(6)),
    ProductImage : new FormControl(""),
    ProductStatuses : new FormControl("", Validators.required),
    ProductId : new FormControl(""),
    //,    selectedCon : new FormControl(this.myselectedCon),
  });

  temp: Content;

  ProductImage: any;
  imagePath: any;

  ngOnInit(): void {
    this.observeTypes.subscribe(data => { //PRODUCT TYPES
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    this.observeStatuses.subscribe(data => { //PRODUCT STATUSES
      this.statusesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    //PATCH VALUES
    this.form.patchValue({
      ProductName: this.data.ProductName,
      ProductDescription: this.data.ProductDescription,
      ProductBarcode: this.data.ProductBarcode,
      ProductStatuses: this.data.ProductStatusId,
      ProductId: this.data.ProductId,
      ProductImage: this.data.ProductImage,
    })

    this.TypeIDSend = this.data.ProductTypeId;
    this.StatusIDSend = this.data.ProductStatusId!;
    this.ProductImage = this.data.ProductImage,


    //this.ProductQuantityList = this.data.contents!;

    this.obj = this.data;
    console.log(this.data)


    if(this.data.ProductTypeId != 3 && this.data.ProductTypeId != 2)
    {
      this.ProductService.getCurrentIngredients(this.data.ProductId).subscribe(res=>
        {
          this.ingredientsList = res;
          console.log(this.ingredientsList);
          this.isIngredient = false;
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
                ProductId : value.productContentId!,
                Quantity : value.quantity!,
              };

              this.ProductQuantityList.push(this.oneProduct);
            }
          });

        })
    }
    else if(this.data.ProductTypeId == 3)
    {
      this.ProductService.getCurrentProducts(this.data.ProductId).subscribe(res=>
        {
          this.packageProductsList = res;
          this.isIngredient = false;
          this.dataSource.data = this.packageProductsList;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return (
              data.productName!.toLowerCase().includes(filter)
            );
          };

          //add current products to a list which will be updated/added to
          this.packageProductsList.forEach((value,index)=>{
            this.check = value;
            if(this.check.quantity! > 0)
            {
              this.oneProduct =
              {
                ProductId : value.productContentId!,
                Quantity : value.quantity!,
              };
              this.ProductQuantityList.push(this.oneProduct);
            }
          });
          console.log(this.ProductQuantityList);
        })
    }
    else if(this.data.ProductTypeId == 2)
    {
      this.isIngredient = true;
      //this.form.reset();
    }

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getProducts(selected:number)
  {
    this.TypeIDSend = selected;
    if(selected != 3 && selected != 2)
    {
      this.ingredientsList = [];
      this.packageProductsList = [];
      this.ProductQuantityList = [];
      this.ProductService.getCurrentIngredients(this.data.ProductId).subscribe(res=>
        {
          this.ingredientsList = res;
          console.log(this.ingredientsList)
          this.isIngredient = false;
          this.dataSource.data = this.ingredientsList;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return (
              data.productName!.toLowerCase().includes(filter)
            );
          };

        })
    }
    else if(selected == 3)
    {
      this.ingredientsList = [];
      this.packageProductsList = [];
      this.ProductQuantityList = [];
      this.ProductService.getCurrentProducts(this.data.ProductId).subscribe(res=>
        {
          this.packageProductsList = res;
          this.isIngredient = false;
          this.dataSource.data = this.packageProductsList;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return (
              data.productName!.toLowerCase().includes(filter)
            );
          };
        })
    }
    else if(selected == 2)
    {
      this.isIngredient = true;
    }


    if(this.ingredientsList != undefined)
    {

      this.ingredientsList.forEach((value,index)=>{
        this.check = value;
        if(this.check.quantity! > 0)
            {
              this.oneProduct =
              {
                ProductId : value.productContentId!,
                Quantity : value.quantity!,
              };
              this.ProductQuantityList.push(this.oneProduct);
            }
       });
    }

    if(this.packageProductsList != undefined)
    {
      this.packageProductsList.forEach((value,index)=>{
        this.check = value;
        if(this.check.quantity! > 0)
        {
          this.oneProduct =
          {
            ProductId : value.productContentId!,
            Quantity : value.quantity!,
          };
          this.ProductQuantityList.push(this.oneProduct);
        }
      });
    }



     console.log("Diff Type selection Product Quantity List",this.ProductQuantityList);
  }

  getStatID(selected: number)
  {
    this.StatusIDSend = selected;
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

  //add content
  updateContent(row: any) {
    console.log(row);
    console.log(row.quantity);

    if(row.quantity <= 0 || row.quantity == null || row.quantity == undefined)
    {
      this._snackBar.open('A quantity must be entered and it may not be a negative number or 0', 'OK');
    }
    else
    {
       console.log("This is Product Quantity List", this.ProductQuantityList);
       if(this.ProductQuantityList.length == 0 || this.ProductQuantityList == undefined || this.ProductQuantityList == null)
       {
        this._snackBar.open(row.productName+" was added to this product's contents!", "OK")._dismissAfter(3000);
       }
       else
       {
        this.ProductQuantityList.forEach((value,index)=>{
          console.log("Value of Product Quantity List", value);
          this.temp = value;
          if(this.temp.ProductId === row.productContentId)
          {
            console.log("Temp", this.temp)
            this._snackBar.open("This item's quantity has been updated from "+ this.temp.Quantity + " to " + row.quantity, "OK")._dismissAfter(3000);
            console.log("test snackbar", this.temp.Quantity)
            this.ProductQuantityList.splice(index,1);
          }
          else
          {
            this._snackBar.open(row.productName+" was added to this product's contents!", "OK")._dismissAfter(3000);
          }

         });
       }

      this.oneProduct = {
        ProductId : row.productContentId,
        Quantity : row.quantity,
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
      if(this.temp.ProductId === row.productContentId)
      {
        console.log("This Temp - delete", this.temp);
        this._snackBar.open(row.productName +" has been removed from the product's content", "OK")._dismissAfter(5000);
        console.log("This index - delete", index)
        this.ProductQuantityList.splice(index,1);
        row.quantity = "";
      }
     });
  }


  //update function
  updateThis(f:any)
  {
    this.productToWrite ={
      ProductId: this.data.ProductId,
      ProductTypeId : this.TypeIDSend,
      ProductStatusId: this.StatusIDSend,
      ProductName : f.ProductName,
      ProductDescription : f.ProductDescription,
      ProductBarcode : f.ProductBarcode,
      ProductImage : f.ProductImage,
      contents : this.ProductQuantityList,
      }
      console.log(this.productToWrite)

      if(this.TypeIDSend == 2)
      {
        this.productToWrite.contents!.length = 0;
        this.productToWrite.ProductBarcode = "";
        this.productToWrite.ProductImage = "";

        this.ProductService.updateProduct(this.productToWrite).subscribe(res => {

          console.log(res);
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              heading: 'Product Successfully Updated',
              message: 'This product has been successfully updated!'
            }})

            success.afterClosed().subscribe(result => {
              console.log('The dialog was closed');

               this.dialogRef.close();
               window.location.reload();

            });
        })
      }
      else if(this.TypeIDSend != 2 && this.ProductQuantityList.length == 0)
      {
        this._snackBar.open('At least one content item must be selected for this product!', 'OK');
      }
      else if(this.TypeIDSend != 2 && this.ProductImage == "")
      {
        this._snackBar.open('An image must be uploaded for this product!', 'OK');
      }
      else
      {
      this.ProductService.updateProduct(this.productToWrite).subscribe(res => {

        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Product Successfully Updated',
            message: 'This product has been successfully updated!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

             this.dialogRef.close();
             window.location.reload();

          });
      })
    }
  }


  openDialog() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Product Update',
        message: 'Are you sure you would like to confirm this update?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if(res)
      {
        console.log(this.ProductImage)

        if(this.TypeIDSend == 2)
        {
          this.updateThis(this.form.value);
        }
        else if(this.TypeIDSend != 2 && this.ProductImage == null)
        {
          this._snackBar.open('Please select an image for this product!', 'OK');
        }
        else
        {
          if(this.selectedImage == null || this.selectedImage == undefined)
          {
            this.updateThis(this.form.value);
          }
          else
          {
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
                this.updateThis(this.form.value);
              }
            })
          }
        }
      }
      else
      {
        console.log('BAD');
      }

    });
  }

  onCancel()
  {
    this.dialogRef.close();
  }

}
