import { ManufacturingService } from 'src/app/services/manufacturing.service';
import { BatchLine } from './../../../../interfaces/manufacturing';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/interfaces/employee';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
export interface PeriodicElement {
  productName: string;
  productSize: string;
  employee: string;
}


@Component({
  selector: 'app-update-batch',
  templateUrl: './update-batch.component.html',
  styleUrls: ['./update-batch.component.scss']
})
export class UpdateBatchComponent implements OnInit {

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


batchlines : any;
quantity:any = [];
cookingListId: any;
cookingListDate: any;
  displayedColumns: string[] = ['productID', 'productName', 'quantity','updatedQuantity','updateQuantiy'];
  dataSource = new MatTableDataSource<BatchLine>();
  constructor(private manufacturingService: ManufacturingService,public dialog: MatDialog,private _snackBar: MatSnackBar, private router:Router) { }

   
  ngOnInit(): void {
    
    this.batchlines = this.manufacturingService.batchDetailsForUpdate;
   
   // this.batchlines = this.data;
  
  
    this.dataSource.data = this.batchlines;

    this.cookingListId = this.batchlines.CookingListId;
    console.log(this.dataSource.data);
    
  }

  updateBatch(row: any,quantityInput: any)
  {
    if (quantityInput <= 0)
    {
      this._snackBar.open("Quantity may not be a negative number nor may it be 0", "Ok");
    }
    else
    {
    var updatedBatch:BatchLine = {
      BatchId : row.BatchId,
      ProductId : row.ProductId,
      Quantity: quantityInput,

    };

    this.manufacturingService.updateBatchDetails(updatedBatch).subscribe(res =>{
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: true,
        data: {
          message: 'The edit of the batch was successful'
        }})

        success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
         
        },  (error: HttpErrorResponse) =>{
          this._snackBar.open('Sorry, there was an error on the server side', 'OK');
    
        });
        
      
    })

   
  }


}
}
