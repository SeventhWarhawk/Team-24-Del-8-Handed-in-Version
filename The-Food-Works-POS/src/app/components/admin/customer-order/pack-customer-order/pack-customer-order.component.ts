import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IOrdersToPack, IOrderItems } from 'src/app/interfaces/customerOrder';
import { CustomerOrderService } from 'src/app/services/customer-order.service';
import { PackOrderDialogComponent } from '../pack-order-dialog/pack-order-dialog.component';

@Component({
  selector: 'app-pack-customer-order',
  templateUrl: './pack-customer-order.component.html',
  styleUrls: ['./pack-customer-order.component.scss']
})
export class PackCustomerOrderComponent implements OnInit {

  displayedColumns: string[] = ['saleID', 'dateOfSale', 'customerName', 'customerTelephone',
  'saleStatus' , 'completionMethod', 'branchName', 'paymentType', 'pack'];
  dataSource: MatTableDataSource<IOrdersToPack>;
  dataArray: any[];
  loadingMode: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private customerOrderService: CustomerOrderService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getOrders();
  }

  packOrderDialog(saleID: any) {
    this.customerOrderService.getOrderItems(saleID).subscribe((res: any) => {
      console.log(res);
      const orderItems: IOrderItems[] = res;

      const dialogRef = this.dialog.open(PackOrderDialogComponent, {
        width: '40vw',
        data: orderItems,
      });

      dialogRef.afterClosed().subscribe(complete => {
        if (complete) {
          this.displaySuccessMessage('Success! Order has been packed');
          this.getOrders();
        }
      });
    });
  }

  getOrders() {
    this.loadingMode = 'query';
    this.customerOrderService.getOrdersToPack().subscribe((res: any) => {
      this.dataArray = res;
      this.dataSource = new MatTableDataSource<IOrdersToPack>(this.dataArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingMode = 'determinate';
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displaySuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }
}
