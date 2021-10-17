import { ModuleType } from './../../../../interfaces/training';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TrainingService } from 'src/app/services/training/training.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateTrainingModuleTypeComponent } from '../update-training-module-type/update-training-module-type.component';
import { CreateTrainingModuleTypeComponent } from '../create-training-module-type/create-training-module-type.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-training-module-type',
  templateUrl: './maintain-training-module-type.component.html',
  styleUrls: ['./maintain-training-module-type.component.scss']
})
export class MaintainTrainingModuleTypeComponent implements AfterViewInit {

  viewTypeUpdate: any;
  displayedColumns: string[] = ['ID', 'Description', 'Update', 'Delete'];
  dataSource = new MatTableDataSource<ModuleType>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  constructor(private trainingService: TrainingService,
    public dialogRef: MatDialogRef<MaintainTrainingModuleTypeComponent>,
    private formBuilder: FormBuilder, public dialog: MatDialog, private snack: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.getAllTypes();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllTypes() {
    this.loadingMode = 'query';
    this.trainingService.getAllTypes().subscribe(res => {
      this.dataSource.data = res;
      console.log(res);
      this.loadingMode = 'determinate';
    });
  }
  getDetailsUpdate(id: number) {
    console.log(id);
    return this.trainingService.getTypeDetails(id).subscribe(res => {
      this.viewTypeUpdate = res;
      const dialogRef = this.dialog.open(UpdateTrainingModuleTypeComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          ID: this.viewTypeUpdate.id,
          Description: this.viewTypeUpdate.description,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
    });
  }
  deleteType(inType: ModuleType) {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Delete',
        message: 'Are you sure you want to delete this training module type?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.trainingService.deleteType(inType).subscribe(r => {
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              message: 'The Training module type has been successfully deleted'
            }
          })
          this.getAllTypes();
        },
          (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.snack.open('You may not delete this module type right now!', 'OK', {
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                duration: 3000
              });
            }
          });
      }
    });
  }




  openModal() {
    const dialogRef = this.dialog.open(CreateTrainingModuleTypeComponent, {
      disableClose: false,
      width: 'auto',
    });

  }
}
