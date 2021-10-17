import { SupplierTypes } from './../../../../interfaces/supplier';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierService } from 'src/app/services/supplier.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { UpdateSupplierTypeComponent } from '../update-supplier-type/update-supplier-type.component';
import { AddSupplierTypeComponent } from '../add-supplier-type/add-supplier-type.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-maintain-supplier-type',
  templateUrl: './maintain-supplier-type.component.html',
  styleUrls: ['./maintain-supplier-type.component.scss']
})
export class MaintainSupplierTypeComponent implements AfterViewInit {

  viewUserRole: any;
  UserRoles: any;
  loadingMode: any;
  displayedColumns: string[] = ['ID', 'name', 'update', 'delete'];
  dataSource = new MatTableDataSource<SupplierTypes>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private snack: MatSnackBar, private SupplierService: SupplierService, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.getAllSupplierTypes();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllSupplierTypes() {
    this.loadingMode = 'query';
    this.SupplierService.getAllSupplierTypes().subscribe(res => {
      this.dataSource.data = res;
      console.log(this.dataSource.data);
      this.loadingMode = 'determinate';
    });
  }

  // For Update
  getSupplierType(SupplierTypeId: number) {
    return this.SupplierService.findSupplierType(SupplierTypeId).subscribe(res => {
      this.viewUserRole = res;
      console.log(res);
      const dialogRef = this.dialog.open(UpdateSupplierTypeComponent, {
        disableClose: true,
        width: 'auto',
        data: {
          SupplierTypeId: this.viewUserRole.id,
          SupplierTypeName: this.viewUserRole.name,
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
      });


    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddSupplierTypeComponent, {
      disableClose: true,
      width: 'auto',
    });

  }

  deleteType(SupplierTypeId: number) {
    console.log(SupplierTypeId);
    return this.SupplierService.findSupplierType(SupplierTypeId).subscribe(res => {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: false,
        data: {
          heading: 'Confirm Supplier Type Deletion',
          message: 'Are you sure you want to delete this type?'
        }
      });
      confirm.afterClosed().subscribe(r => {
        if (r) {
          this.SupplierService.deleteType(SupplierTypeId).subscribe(o => {

            console.log(res);
            const success = this.dialog.open(SuccessModalComponent, {
              disableClose: true,
              data: {
                heading: 'Supplier Type Successfully Deleted',
                message: 'This supplier type was successfully deleted!'
              }
            })
            success.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              window.location.reload();
            });

            this.getAllSupplierTypes();
          }, (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.snack.open('You may not delete this supplier type right now!', 'OK', {
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                duration: 3000
              });
            }
          }
          );
        }
      });
    });
  }
}



