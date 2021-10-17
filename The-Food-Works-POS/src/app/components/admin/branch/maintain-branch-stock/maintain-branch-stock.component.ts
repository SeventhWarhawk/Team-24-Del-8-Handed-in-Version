import { BranchService } from './../../../../services/branch.service';
import { Subscription } from 'rxjs';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Import Interfaces
import { BranchProduct } from 'src/app/interfaces/admin';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AssignProductComponent } from '../assign-product/assign-product.component';
import { UpdateBranchStockComponent } from '../update-branch-stock/update-branch-stock.component';
import { BranchProductUpdate } from 'src/app/interfaces/branch';

@Component({
  selector: 'app-maintain-branch-stock',
  templateUrl: './maintain-branch-stock.component.html',
  styleUrls: ['./maintain-branch-stock.component.scss']
})
export class MaintainBranchStockComponent implements OnInit {

  // Data Member to Hold Currently Logged in Branch ID
  currentBranchId: any;
  viewBranchProduct: BranchProductUpdate;
  // Initialize Maintain Branch Stock Table
  private subs = new Subscription();
  displayedColumns: string[] = ['ProductId', 'ProductTypeName', 'ProductName', 'QuantityOnHand', 'BaselineQuantity', 'ProductPrice', 'ProductStatus', 'urgency', 'update'];
  public dataSource: MatTableDataSource<BranchProduct>;
  loadingMode: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataArray: any;
  private dataArrayAll: any;
  productTypes: any = [];

  constructor(private branchService: BranchService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadingMode = 'query';
    this.populateTable()
    // Populate Drop Down with Product Types
    this.branchService.getProductTypes().subscribe((resp: any) => {
      console.log(resp);
      this.productTypes = resp;
    }, (error: any) => {
      console.log("Unable to get product Names")
    })
  }

  openModal() {
    const dialogRef = this.dialog.open(AssignProductComponent, {
      disableClose: false,
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(r => {
      this.populateTable();
    });
  }

  async populateTable() {
    this.loadingMode = 'query';
    const id = this.branchService.getBranchId();
    id.subscribe(resp => {
      // Subscribe to "getBranchData" service method and populate Maintain Branch Table
      this.subs.add(this.branchService.getBranchStock(resp).subscribe(
        (resp: any) => {
          console.log(resp);
          this.dataArray = resp;
          this.dataSource = new MatTableDataSource<BranchProduct>(this.dataArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loadingMode = 'determinate';
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.loadingMode = 'determinate';
        }
      ))
    })
  }

  // Search Filter for Maintain Branch Stock Table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyTypeFilter(type: any) {
    console.log(type)
    const filterValue = type
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // For Update
  getProduct(ProductId: number, type: string) {
    console.log(type);
    return this.branchService.findProduct(ProductId, JSON.parse(localStorage.getItem('branch')!)).subscribe(res => {
      console.log(res);
      this.viewBranchProduct = res;
      if (type == "Ingredient") {
        this.viewBranchProduct.productPrice = 0;
      }
      if (res.productPrice == null) {
        this.viewBranchProduct.productPrice = -1;
      }
      else {
        this.viewBranchProduct.productPrice = res.productPrice.productPriceAmount;
      }
      const dialogRef = this.dialog.open(UpdateBranchStockComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          productId: this.viewBranchProduct.productId,
          baselineQuantity: this.viewBranchProduct.baselineQuantity,
          productPrice: this.viewBranchProduct.productPrice,
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
        this.populateTable();
        this.ngOnInit();
      });
      this.ngOnInit();

    });
  }
}
