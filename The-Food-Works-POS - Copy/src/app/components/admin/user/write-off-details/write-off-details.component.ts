import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Product, WriteOff } from 'src/app/interfaces/admin';
import { AdminService } from 'src/app/services/admin/admin.service';
// import { WriteOffDetailsDialogComponent } from 'src/app/components/modals/write-off-details-dialog/write-off-details-dialog.component';

@Component({
  selector: 'app-write-off-details',
  templateUrl: './write-off-details.component.html',
  styleUrls: ['./write-off-details.component.scss']
})
export class WriteOffDetailsComponent implements OnInit {

  // writeoffdetails!: FormGroup;
  toDisplay: WriteOff;
  products: any;
  writeOffs: WriteOff[];
  branchId = this.adminService.branchId;
  mode: boolean;
  Rows: any;
  displayedColumns: string[] = ['Product_ID', 'Product_Name', 'Write_Off_Reason', 'Write_Off_Quantity', 'Write_Off'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  constructor(public adminService: AdminService, @Inject(MAT_DIALOG_DATA) public data: Product,
    public dialog: MatDialog, private router: Router, private snack: MatSnackBar,
    public dialogRef: MatDialogRef<WriteOffDetailsComponent>, private fb: FormBuilder) { }

  form: FormGroup = new FormGroup({
    WOReason: new FormControl('', Validators.required),
    WOQuantity: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.dataSource.data = this.adminService.products[0];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.writeOffs = [];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getProducts() {
    this.loadingMode = 'query';
    this.adminService.getProducts().subscribe(res => {
      this.products = res;
      this.loadingMode = 'determinate';
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm Write Off Details',
        message: 'Are you sure you want to write-off these items?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.adminService.WriteOff(this.writeOffs).subscribe(r => {
          console.log(this.adminService.products[0]);
          //this.dataSource.data = this.adminService.products[0].splice(this.toDisplay.productId, 1);
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              message: 'The selected products were successfully written off.'
            }
          });
          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.router.navigateByUrl('admin-home/write-off');
          });
        },
          (error: HttpErrorResponse) => {
            if (error.status === 400) {
              console.log("ERROR")
              this.snack.open('An error occurred server side. Please try again!', 'OK');
            }
          }
        )
      }
    });
  }

  confirm(id: number) {
    console.log(id);
    this.verifyWriteOff(this.form.value, id);
  }

  verifyWriteOff(formValue: any, id: number) {
    this.toDisplay =
    {
      productId: id,
      branchId: this.branchId,
      WOReason: formValue.WOReason,
      WOQuantity: formValue.WOQuantity
    };
    this.adminService.ValidateWO(this.toDisplay).subscribe(res => {
      if (res) {
        console.log(this.writeOffs);
        this.writeOffs.push(this.toDisplay);
      }
      else if (!res) {
        this.snack.open('Invalid Write Off Quantity! Value cannot negative or be more than the Quantity on Hand', 'OK', {
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          duration: 4000
        });
      }
    });
  }
}
