import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { IViewDelivery } from 'src/app/interfaces/delivery';
import { DeliveryService } from 'src/app/services/delivery.service';
import { ViewDeliveryModalComponent } from '../view-delivery-modal/view-delivery-modal.component';

export interface PeriodicElement {
  deliveryID: string;
  saleID: string;
  customer: string;
  address: string;
}

@Component({
  selector: 'app-view-delivery',
  templateUrl: './view-delivery.component.html',
  styleUrls: ['./view-delivery.component.scss']
})
export class ViewDeliveryComponent implements OnInit {

  displayedColumns: string[] = ['Delivery_ID', 'Sale_ID', 'Customer', 'Address', 'View'];
  dataSource: MatTableDataSource<IViewDelivery>;
  dataArray: any[];
  loadingMode: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private service: DeliveryService) { }

  ngOnInit() {
    this.loadingMode = 'query';
    this.service.getAllDeliveries().subscribe((res: any) => {
      this.dataArray = res;
      this.dataSource = new MatTableDataSource<IViewDelivery>(this.dataArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingMode = 'determinate';
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(deliveryID: any) {
    this.dialog.open(ViewDeliveryModalComponent, {
      width: '40vw',
      data: deliveryID
    });
  }
}
