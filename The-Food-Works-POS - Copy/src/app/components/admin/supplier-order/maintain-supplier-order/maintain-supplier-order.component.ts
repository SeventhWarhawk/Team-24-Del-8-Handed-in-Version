import { ReceiveSupplierOrderComponent } from './../receive-supplier-order/receive-supplier-order.component';
import { SupplierOrderService } from './../../../../services/supplier-order.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SupplierOrder } from 'src/app/interfaces/supplierOrder';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'maintain-supplier-order',
  templateUrl: './maintain-supplier-order.component.html',
  styleUrls: ['./maintain-supplier-order.component.scss']
})
export class MaintainSupplierOrderComponent implements AfterViewInit {
  SupplierOrders: any;
  viewOrderUpdate : any;
  form : FormGroup;
  loadingMode: any;

  displayedColumns: string[] = ['SupplierOrderId', 'SupplierName', 'SupplierOrderDate', 'SupplierOrderStatusName', 'view'];
  dataSource = new MatTableDataSource<SupplierOrder>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog,private SupplierOrderService : SupplierOrderService) { }

  ngOnInit(): void {
    this.getSupplierOrders();
    this.form = this.formBuilder.group({
      SupplierOrderId: [null],
      SupplierOrderDate: [null],
      SupplierName: [null],
      productsNames: [null],
      quantities: [null],
      })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //all supplier orders
  getSupplierOrders()
  {
    this.loadingMode = 'query';
    this.SupplierOrderService.getSupplierOrders().subscribe(res=>
      {
        this.SupplierOrders = res;
        //add 'data' in order to filter
        this.dataSource.data = this.SupplierOrders;

        //override table filter
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return (
            data.SupplierOrderId.toString().includes(filter)
          );
        };
        this.loadingMode = 'determinate';
      })
  }

  //For View
  isPlaced: boolean = false;
  viewOrder : any;
  viewSupplierOrder(SupplierOrderId: number)
  {
    console.log("View Part " + SupplierOrderId);

    return this.SupplierOrderService.getOneSupplierOrder(SupplierOrderId).subscribe(res => {
      this.viewOrder = res;
      console.log (this.viewOrder);

      if(this.viewOrder.orderStatusId == 1)
      {
        this.isPlaced = true;
      }

      var formattedDate = this.viewOrder.supplierOrderDate?.substring(0, 10);
      console.log ("Formatted Date ", formattedDate);

      this.form.patchValue({
        SupplierOrderId: this.viewOrder.supplierOrderId,
        SupplierOrderDate: formattedDate,
        SupplierName : this.viewOrder.supplierName
      });

    });
  }

  onCancel()
  {
    window.location.reload();
  }

  onClick()
  {
    window.open(this.viewOrder.invoiceImage);
  }


  //For receiving the order
  getOneOrder(SupplierOrderId: number)
    {
      return this.SupplierOrderService.getOneSupplierOrder(SupplierOrderId).subscribe(res => {
        this.viewOrderUpdate = res;
       console.log ("View one order", this.viewOrderUpdate)
        const dialogRef = this.dialog.open(ReceiveSupplierOrderComponent, {
         disableClose: true,
         width: '1100px',
         height: '550px',
         data: {
          SupplierOrderId: this.viewOrderUpdate.supplierOrderId,
          SupplierOrderStatusId : this.viewOrderUpdate.orderStatusId,
        }
       });

       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed');

       });


     });
    }
}
