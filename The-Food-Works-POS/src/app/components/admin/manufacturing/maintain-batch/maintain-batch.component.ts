import { logging } from 'protractor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateBatchComponent } from './../update-batch/update-batch.component';
import { ManufacturingService } from './../../../../services/manufacturing.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import {formatDate} from '@angular/common';


export interface PeriodicElement {
  batchID: string;
  cookingListDate: string;
  batchStatus: string;
}

@Component({
  selector: 'app-maintain-batch',
  templateUrl: './maintain-batch.component.html',
  styleUrls: ['./maintain-batch.component.scss']
})
export class MaintainBatchComponent implements AfterViewInit {

  batches: any;

  updateBatchDetails: any;

  displayedColumns: string[] = ['cookingListDate','batchID', 'batchStatus', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  constructor(private manufacturingService: ManufacturingService, public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.getAllBatches();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllBatches() {
    this.loadingMode = 'query';
    this.manufacturingService.getBatches().subscribe(res => {
      console.log(res);
      this.batches = res;
      this.dataSource.data = this.batches;
      this.loadingMode = 'determinate';
    });

  }

  openUpdateModal(batchId: any, cookingListDate: any) {

    // console.log(batchId);
    console.log('this is the cooking list date', cookingListDate);

    let currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');



    console.log('this is the current date', currentDate);
    if (cookingListDate < currentDate)
{
  this._snackBar.open('Sorry, This batch may not be edited as it is in the past', 'OK');

}
else
{
    this.manufacturingService.getBatchDetails(batchId).subscribe(res => {
      this.updateBatchDetails = res;
      const dialogRef = this.dialog.open(UpdateBatchComponent, {
        disableClose: false,
        width: '1000px',
        height: '500px',
        data: {
          BatchLines: this.updateBatchDetails,
      }
      });

      this.manufacturingService.batchDetailsForUpdate = this.updateBatchDetails;

    }, (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    });
  }

  }

  deleteBatch(batchId: any) {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Delete Batch',
        message: 'Are you sure you would delete this batch?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.manufacturingService.deleteBatch(batchId).subscribe(res => {
          this.getAllBatches();
          this._snackBar.open('The Batch was successfully deleted', 'OK').afterDismissed().subscribe(x => {
            this.getAllBatches;
          });

        }, (error: HttpErrorResponse) => {
          console.log(error);
          this._snackBar.open('Sorry, this batch cannot be deleted. You may only delete batches from the past that have not get been reconciled', 'OK');

        });
      }
      else {
        console.log('BAD');
      }


    });

  }
}
