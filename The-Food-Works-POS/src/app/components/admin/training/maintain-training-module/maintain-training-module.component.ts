import { TrainingService } from './../../../../services/training/training.service';
import { Module, ModuleType } from './../../../../interfaces/training';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-maintain-training-module',
  templateUrl: './maintain-training-module.component.html',
  styleUrls: ['./maintain-training-module.component.scss']
})
export class MaintainTrainingModuleComponent implements AfterViewInit {

  // Initialize Maintain Training Module Table
  private subs = new Subscription();
  displayedColumns: string[] = ['trainingModuleId', 'moduleName', 'moduleLanguage', 'moduleDuration', 'trainingModuleType', 'contentOrder', 'viewUpdate', 'delete'];
  public dataSource: MatTableDataSource<Module>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataArray: any;
  loadingMode: any;

  constructor(private service: TrainingService, private snack: MatSnackBar, public dialogRef: MatDialogRef<MaintainTrainingModuleComponent>,
    private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.loadingMode = 'query';
    // Subscribe to "getTrainingData" service method and populate Maintain Training Table
    this.subs.add(this.service.getAllTrainingModules().subscribe(
      (resp: any) => {
        console.log(resp)
        this.dataArray = resp;
        this.dataSource = new MatTableDataSource<Module>(this.dataArray);
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

  public formatString(item: string): string {
    if (item == null) {
      return "No Content"
    }
    else {
      return item.replace(/,/g, ", ")
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteType(inType: number) {
    console.log(inType);
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Delete',
        message: 'Are you sure you want to delete this training module?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteModule(inType).subscribe(r => {
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              message: 'The Training module has been successfully deleted'
            }
          })
          this.ngAfterViewInit();
        },
          (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.snack.open('You may not delete this module right now!', 'OK', {
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                duration: 3000
              });
            }
          });
      }
    });
  }
}
