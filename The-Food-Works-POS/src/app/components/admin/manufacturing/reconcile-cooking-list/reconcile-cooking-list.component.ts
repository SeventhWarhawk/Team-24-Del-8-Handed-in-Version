import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CookingList, BatchLine } from './../../../../interfaces/manufacturing';
import { ManufacturingService } from 'src/app/services/manufacturing.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Component({
  selector: 'app-reconcile-cooking-list',
  templateUrl: './reconcile-cooking-list.component.html',
  styleUrls: ['./reconcile-cooking-list.component.scss']
})
export class ReconcileCookingListComponent implements AfterViewInit {

  employees: any;
  cookingList: any;
  clId: any;
  clDate: any;
  batchId: any;

  productsToUpdate: any = [];

  quantity: any = [];
  employee: any = [];
  selectedValue: any = [];
  totalProducts: number;

  displayedColumns: string[] = ['batchId','productName', 'quantityProduced','employee', 'reconcileQuantity'];
  dataSource =new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  constructor(private manufacturingService: ManufacturingService, private _snackBar: MatSnackBar,private route:Router,public dialog: MatDialog) { }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.loadingMode = 'query';

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.manufacturingService.getEmployees().subscribe(res => {
      console.log(res);
      this.employees = res;

    }, (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    })



    this.manufacturingService.getCookingListDetails().subscribe(res => {
      console.log(res[0])
      if (res == null)
      {
        this._snackBar.open('Sorry, there is no cooking list for today', 'OK');
      }
      else
      {
      this.cookingList = res;
      this.totalProducts = res.length;
      this.dataSource.data = this.cookingList;
      this.clId =this.cookingList[0].CookingListId;
      this.clDate = this.cookingList[0].CookingListDate;
      console.log(this.dataSource.data);
      }
      this.loadingMode = 'determinate';
    },  (error: HttpErrorResponse) =>{
      if (error.status === 403) {
        this._snackBar.open('The cooking list for today has already been reconciled', 'OK');
        this.loadingMode = 'determinate';
      }
      else {
        this._snackBar.open('The cooking list for today has already been reconciled', 'OK');
        this.loadingMode = 'determinate';
      }
    })
  }
  reconcileQuantity(row: any, quantity: any, employee:any, batchId: any) {
    console.log(row);
    if(quantity <= 0 || quantity == null)
    {
      this._snackBar.open('Quantity may not be a negative number, 0 or empty', 'OK');

    }
    else
    {
      if(employee == null)
      {
        this._snackBar.open('Please Select an Employee', 'OK');

      }
      else
      {
        console.log(quantity);
        var product: BatchLine =
        {
          ProductId: row.ProductId,
          Quantity: quantity,
          EmployeeID: employee,
          BatchId: batchId,

        };
        this.batchId = row.BatchId;

        this.productsToUpdate.push(product);

        this._snackBar.open(row.ProductName+' was added to the reconciliation')._dismissAfter(3000);
      }



  }


  }
  reconcileBatch() {
    console.log(this.productsToUpdate.length)
    if(this.totalProducts != this.productsToUpdate.length)
    {
      this._snackBar.open("You have not reconciled all the products on the list", 'OK')
    }
    else{
      var detailsToUpdate: BatchLine =
      {
        BatchLines: this.productsToUpdate,
        BatchId: this.batchId,

      };

      this.manufacturingService.reconcileBatch(detailsToUpdate).subscribe(res => {
        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            message: 'The cooking list was successfully reconciled.'
          }
        })

        success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.route.navigateByUrl('/admin-home');
        });



      })

    }
  }


}
