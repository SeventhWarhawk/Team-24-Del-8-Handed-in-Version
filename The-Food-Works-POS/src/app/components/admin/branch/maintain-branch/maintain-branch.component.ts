import { HttpErrorResponse } from '@angular/common/http';
import { BranchService } from './../../../../services/branch.service';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Import Interfaces
import { Branch } from 'src/app/interfaces/branch';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-branch',
  templateUrl: './maintain-branch.component.html',
  styleUrls: ['./maintain-branch.component.scss']
})
export class MaintainBranchComponent implements OnInit {

  // Initialize Maintain Branch Table
  private subs = new Subscription();
  displayedColumns: string[] = ['BranchId', 'BranchName', 'BranchStatus', 'BranchDateCreated', 'viewUpdate', 'delete'];
  public dataSource: MatTableDataSource<Branch>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataArray: any;
  loadingMode: any;

  constructor(private branchService: BranchService, public dialog: MatDialog, private snack: MatSnackBar) { }

  ngOnInit() {

    this.loadingMode = 'query';
    // Subscribe to "getBranchData" service method and populate Maintain Branch Table
    this.subs.add(this.branchService.getBranchData().subscribe(
      (resp: any) => {
        this.dataArray = resp;
        this.dataSource = new MatTableDataSource<Branch>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loadingMode = 'determinate';
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.loadingMode = 'determinate';
      }
    ))

  }

  // Search filter for Maintain Branch table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllBranches() {
    this.subs.add(this.branchService.getBranchData().subscribe(
      (resp: any) => {
        this.dataArray = resp;
        this.dataSource = new MatTableDataSource<Branch>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    ));
  }
  deleteBranch(BranchId: number) {
    console.log(BranchId);
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm Branch Deletion',
        message: 'Are you sure you want to delete this branch?'
      }
    });
    confirm.afterClosed().subscribe(r => {
      if (r) {
        this.branchService.deleteBranch(BranchId).subscribe(o => {
          this.getAllBranches();
        }, (error: HttpErrorResponse) => {
          this.snack.open('Delete Failed - this branch is already in use!', 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: 3000
          });
        });
      }
    });
  }
}

