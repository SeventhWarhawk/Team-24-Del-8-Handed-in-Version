import { SupplierCombined } from './../../../../interfaces/supplier';
import { UpdateSupplierComponent } from './../update-supplier/update-supplier.component';
import { PlaceSupplierOrderComponent } from './../../supplier-order/place-supplier-order/place-supplier-order.component';
import { SupplierService } from './../../../../services/supplier.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Supplier } from 'src/app/interfaces/supplier';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from './../../../modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-maintain-supplier',
  templateUrl: './maintain-supplier.component.html',
  styleUrls: ['./maintain-supplier.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaintainSupplierComponent implements AfterViewInit {

  Suppliers: any;
  viewSupplier: any;
  loadingMode: any;
  //address: any;

  displayedColumns: string[] = ['SupplierName', 'SupplierStatusName', 'SupplierTypeName', 'SupplierVatNumber', 'SupplierContactNumber', 'SupplierEmailAddress', 'orderDay', 'OrderMethodName', 'place', 'update', 'delete'];
  dataSource = new MatTableDataSource<Supplier>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  expandedElement: null;

  constructor(private _snackBar: MatSnackBar, public SupplierService: SupplierService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSuppliers();
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //all suppliers
  getSuppliers() {
    this.loadingMode = 'query';
    this.SupplierService.getSuppliers().subscribe(res => {
      this.Suppliers = res;
      console.log(res);
      this.dataSource.data = this.Suppliers;

      //override table filter
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (
          data.SupplierName.toLowerCase().includes(filter)
        );
      };

      this.loadingMode = 'determinate';
    })
  }

  orderPlace: any;

  updateSupplier(SupplierId: number) {
    console.log(SupplierId);
    return this.SupplierService.findSupplier(SupplierId).subscribe(res => {
      this.viewSupplier = res;
      console.log(res);
      const dialogRef = this.dialog.open(UpdateSupplierComponent, {
        disableClose: true,
        height: "550px",
        width: "1050px",
        data: {
          SupplierName: this.viewSupplier.supplierName,
          SupplierVatNumber: this.viewSupplier.supplierVatNumber,
          SupplierContactNumber: this.viewSupplier.supplierContactNumber,
          SupplierEmailAddress: this.viewSupplier.supplierEmailAddress,
          OrderMethodName: this.viewSupplier.orderMethodID,
          SupplierTypeId: this.viewSupplier.supplierTypeID,
          SupplierStatusId: this.viewSupplier.supplierStatusID,
          days: this.viewSupplier.days,
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
      });

    });
  }

  openModal(supplierId: any) {
    console.log("This is the supplier ", supplierId)
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Supplier Deletion',
        message: 'Are you sure you would like to confirm this deletion?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('Deleted Successfully');
        this.SupplierService.deleteSupplier(supplierId).subscribe(res => {
          console.log(res);
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              heading: 'Supplier Successfully Deleted',
              message: 'This supplier was successfully deleted!'
            }
          })

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            window.location.reload();
          });

        },
          (error: HttpErrorResponse) => {
            console.log("ERROR RESPONSE WORKS")
            if (error.status === 400) {
              console.log("ALERT ERROR WORKS")
              this._snackBar.open("This supplier cannot be deleted! However, you can change the supplier's status to inactive.", 'OK');
            }
          }
        )
      }
      else {
        console.log('BAD');
      }

    });

  }


  //  orderPlace: any;
  placeSupplierOrder(SupplierVatNumber: string, SupplierName: string) {
    const dialogRef = this.dialog.open(PlaceSupplierOrderComponent, {
      disableClose: true,
      width: 'auto',
      data: {
        SupplierVatNumber: SupplierVatNumber,
        SupplierName: SupplierName,
      }
    });
  }

  //Inactive supplier
  notAllowed() {
    this._snackBar.open("Orders cannot be placed with inactive suppliers!", "OK", {
      duration: 8000
    });
  }


}

