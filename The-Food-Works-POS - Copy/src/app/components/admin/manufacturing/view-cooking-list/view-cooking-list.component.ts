import { CookingListView } from './../../../../interfaces/manufacturing';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ManufacturingService } from './../../../../services/manufacturing.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';


@Component({
  selector: 'app-view-cooking-list',
  templateUrl: './view-cooking-list.component.html',
  styleUrls: ['./view-cooking-list.component.scss']
})

export class ViewCookingListComponent implements AfterViewInit {

  cookingLists: any;

  updateBatchDetails: any;

  toViewCookingList: CookingListView;

  batches: any;

  batchLines: any;

  cookiningListDate: any;

  displayedColumns: string[] = [ 'cookingListDate', 'view', 'delete'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  constructor(private manufacturingService: ManufacturingService, public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar, ) { }

  ngAfterViewInit(): void {
    this.getAllCookingListDetails();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  getAllCookingListDetails()
  {
    this.loadingMode = 'query';
    this.manufacturingService.getAllCookingLists().subscribe(res => {
      console.log(res);
      this.cookingLists = res;
      this.dataSource.data = this.cookingLists;
      this.loadingMode = 'determinate';
    },  (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');
      this.loadingMode = 'determinate';
    });
  }

  viewCookingList(CookingListID: any)
  {
    this.manufacturingService.getSpecificCookingListDetails(CookingListID).subscribe(res => {
      this.batches = res.batches;
      console.log(this.batches[0]);
      if (this.batches[0] != null)
      {
        this.toViewCookingList = res;
        this.batches = res.batches;
        this.batchLines = res.batchLines;
        this.cookiningListDate = CookingListID;

      }
      else
      {

      this._snackBar.open('Sorry, there are no batches for this cooking list', 'OK');
      }

    });
  }

  goBack()
  {
    this.viewCookingList == null;
    location.reload();
  }

  deleteCookingList(CookingListID: any)
  {
    this.manufacturingService.deleteCookingList(CookingListID).subscribe(res => {
      this._snackBar.open('The Cooking List has successfully been deleted', 'OK').afterDismissed().subscribe(res => {
        location.reload();
      });
    },  (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, this cooking list may not be deleted as it has batches', 'OK');
    }
      );

  }


}

