import { Router } from '@angular/router';
import { AddCookingListComponent } from './../../../modals/add-cooking-list/add-cooking-list.component';
import { CookingList, ProductsNeeded, BatchLine } from './../../../../interfaces/manufacturing';
import { SelectCookingListComponent } from './../../../modals/select-cooking-list/select-cooking-list.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManufacturingService } from 'src/app/services/manufacturing.service';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss']
})
export class CreateBatchComponent implements OnInit {

  productsNeeded: any;
  batchLines: any = [];
  quantitysStillNeeded: any;
  quantity: any = [];

  cookingListId: any;

  cookinglists: any;
  cookingList: CookingList ;
  cookingListToSend: CookingList;
  cookingListCreated: any;
  displayedColumns: string[] = ['productID', 'productBarcode', 'productName', 'qtyOrdered', 'qtyRequested', 'qtyOnHand', 'qtyStillNeeded', 'qtyToProduce', 'addtoList', 'qtyOutstanding'];
  dataSource = new MatTableDataSource<ProductsNeeded>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog, private manufacturingService: ManufacturingService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.loadingMode = 'query';
    this.manufacturingService.getAllCookingLists().subscribe(res => {
      console.log(res);
      this.manufacturingService.cookingLists = res;
      const selectCookingList = this.dialog.open(SelectCookingListComponent, {
        disableClose: true,
        data: {
          message: res
        }
        });
      selectCookingList.afterClosed().subscribe(res => {
          this.getProductsNeeded();
          console.log('this is the result', res);
          if (res != 'add')
          {

            this.cookingList = res;
            console.log('this is the selected cooking list ', this.cookingList);
          }
          else
          {
            const addCooking = this.dialog.open(AddCookingListComponent, {
              disableClose: false,

              });

            addCooking.afterClosed().subscribe(res => {
                // console.log(res);
                this.cookingListToSend = {
                 CookingListDate: res,

                };

                this.manufacturingService.addCookingList(this.cookingListToSend).subscribe(res => {
                    console.log(res);

                    this.cookingListCreated = res;




                },  (error: HttpErrorResponse) => {
                  console.log(error.status);
                   if (error.status === 403){
                     this._snackBar.open('There is already a cooking list for this date', 'OK',{ duration: 5000 });
                     this.router.navigateByUrl('admin-home')
                   }
                   else{
                     this._snackBar.open('Sorry, there was an error on the server side', 'OK');
                   }});
              });
          }

        },  (error: HttpErrorResponse) => {
          this._snackBar.open('Sorry, there was an error on the server side', 'OK');

        });
      this.loadingMode = 'determinate';
    },  (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');
      this.loadingMode = 'determinate';
    });
  }

  getProductsNeeded()
  {
    this.loadingMode = 'query';
    this.manufacturingService.getProductsNeeded().subscribe(res => {
      console.log(res);
      this.productsNeeded = res;

      for (const product of this.productsNeeded)
      {
        this.quantitysStillNeeded = product.quantityOnHand - (product.quantityOrdered + product.quantityRequested);
        // console.log(this.quantitysStillNeeded)
        if (this.quantitysStillNeeded > 0)
        {
          this.quantitysStillNeeded  = this.quantitysStillNeeded * -1;
        }
        else{
          this.quantitysStillNeeded  = this.quantitysStillNeeded * -1;
        }
        product.quantitysStillNeeded  = this.quantitysStillNeeded;
        product.quatitityToProduce = 0;
        product.quantityOutstanding = product.quantitysStillNeeded - product.quatitityToProduce;
      }
      this.dataSource.data = this.productsNeeded;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log(this.productsNeeded)
      this.loadingMode = 'determinate';
    },  (error: HttpErrorResponse) => {
        this._snackBar.open('Sorry, there was an error on the server side', 'OK');
        this.loadingMode = 'determinate';
    });

  }

  getCookingLists()
  {


  }

  addtoBatch(row: any, quantityInput: any)
  {
   console.log(row, quantityInput);

   if (row.quantity <= 0)
    {
      this._snackBar.open('Quantity may not be a negative number nor may it be 0', 'OK');

    }
    else
    {
        let batch: BatchLine = {
          ProductId : row.productId,
          Quantity: row.quantity,
        };

        this.batchLines.push(batch);
        this._snackBar.open(row.productName + ' was added to the batch')._dismissAfter(3000);
    }

   // console.log(this.batchLines)
  }

  writeBatch(id: any)
  {
    let batchTowrite: BatchLine =
    {
      CookingListID : id,
      BatchLines: this.batchLines,

    };

    // console.log(batchTowrite);
    this.manufacturingService.writeBatch(batchTowrite).subscribe(res => {
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: true,
        data: {
          message: 'The batch was sucessfully added to the cooking list'
        }});

      success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.router.navigateByUrl('/admin-home');




    });
  },  (error: HttpErrorResponse) => {
    this._snackBar.open('Sorry, there was an error on the server side', 'OK');

  });
  }



}
