import { BranchProductAssign } from './../../../../interfaces/branch';
import { ReportService } from 'src/app/services/report/report.service';
import { BranchService } from 'src/app/services/branch.service';
import { Branch } from 'src/app/interfaces/report';
import { Product, SelectedProduct } from './../../../../interfaces/admin';
import { Component, ViewChild, AfterViewInit, OnInit, NgModule } from '@angular/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchProduct } from 'src/app/interfaces/admin';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-assign-product',
  templateUrl: './assign-product.component.html',
  styleUrls: ['./assign-product.component.scss']
})
export class AssignProductComponent implements OnInit {

  constructor(public branchService: BranchService, public dialog: MatDialog, public BranchService: BranchService, public serv: ReportService, private router: Router, private _snackBar: MatSnackBar) { }

  quantity: any = [];
  price: any = [];
  tempBranchProducts: BranchProductAssign[] = [];


  displayedColumns: string[] = ['ID', 'name', 'baselineQuantity', 'productPriceAmount', 'Assign'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  selected = new FormControl(false);
  ngOnInit() {
    this.branchService.getProductsToAssign().subscribe(res => {
      console.log(res);
      this.dataSource.data = res;
    }, (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

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

  addToList(row: any) {
    console.log(row)
    if (row.baselineQuantity <= 0 || row.baselineQuantity == null) {
      this._snackBar.open('The Base Line Quantity may not be zero, less than zero or empty', 'OK');
    }
    else if (row.productPriceAmount < 0) {
      this._snackBar.open('The Price may not be less than zero', 'OK');
    }
    else {
      this.tempBranchProducts.push(row);
      console.log(this.tempBranchProducts);
      this._snackBar.open(row.productName + ' was added to the list to assign to this branch')._dismissAfter(3000);
    }
  }

  assignProducts() {
    this.BranchService.assignProducts(this.tempBranchProducts).subscribe(res => {
      console.log(res)
    }, (error: HttpErrorResponse) => {
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    })

  }






}


