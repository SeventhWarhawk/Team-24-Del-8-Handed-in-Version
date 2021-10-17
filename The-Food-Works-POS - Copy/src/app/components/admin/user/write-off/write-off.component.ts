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
import { WriteOffDetailsComponent } from '../write-off-details/write-off-details.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.scss']
})
export class WriteOffComponent implements OnInit {
  constructor(public adminService: AdminService, public dialog: MatDialog, public BranchService: BranchService, public serv: ReportService, private router: Router) { }
  observeBranches: Observable<Branch[]> = this.serv.getBranches();
  selectedOption: number;
  TypeIDSend: number = 0;
  Products: any;
  contentList: Product[];
  selectedContents: any
  selectedProducts: SelectedProduct[] = [];
  temp: number[] = [];
  created = false;
  viewProduct: any;
  branchData: Branch[];
  displayedColumns: string[] = ['ID', 'name', 'description', 'QOH', 'Select'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;


  selected = new FormControl(false);
  ngOnInit() {
    this.observeBranches.subscribe(data => {
      this.branchData = data;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (
          data.name.toLowerCase().includes(filter)
        );
      };
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getBranches(selected: number) {
    this.TypeIDSend = selected;
    this.loadingMode = 'query';
    this.adminService.getProducts().subscribe(res => {
      for (var i = 0; i < res.length; i++) {
        if (res[i].ID == this.TypeIDSend) {
          this.dataSource.data = res[i].Products;
          //this.dataSource = res[i].Products;
          this.created = true;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return (
              data.name.toLowerCase().includes(filter)
            );
          };
        }
      }
      this.loadingMode = 'determinate';
    });
  }

  // getAllProducts() {
  //   this.adminService.getProducts().subscribe(res => {
  //     this.branchData = res;
  //     for (var i = 0; i < res.length; i++) {
  //       this.dataSource = res[i].Products;
  //     }
  //     console.log(res);

  //   });
  //   this.created = true;
  //   this.dataSource.filterPredicate = function (data, filter: string): boolean {
  //     return (
  //       data.name.toLowerCase().includes(filter)
  //     );
  //   }
  // }

  // change(event: any) {
  //   const checked = document.getElementById('box');
  //   if (event) {
  //     console.log(event.source.value, event.source.selected); // checked?.onchange === true

  //     if (event.source.selected === false) {
  //       console.log('This is false - no modal');
  //     }
  //     else {
  //       // this.openModal();
  //       console.log('This is true - show modal');
  //       // this.pid = event.source.value;
  //     }
  //   }
  // }

  AddToList(SelectedId: number, BranchId: number, checkbox: MatCheckbox) {
    const isAdding = !checkbox.checked;
    // this.adminService.branchId = BranchId;
    BranchId = this.TypeIDSend;
    this.adminService.branchId = BranchId;
    if (isAdding) {
      this.selectedProducts.push({ BranchId, SelectedId });
    }
    else {
      for (let i = 0; i < this.selectedProducts.length; i++) {
        const tmpObj = this.selectedProducts[i];
        if (tmpObj.SelectedId === SelectedId && tmpObj.BranchId === BranchId) {
          this.selectedProducts.splice(i, 1);
          console.log(this.selectedProducts);
          break;
        }
      }
    }
  }

  sendList() {
    return this.adminService.findProduct(this.selectedProducts).subscribe(res => {
      this.adminService.products = [];
      this.adminService.products.push(res);
      console.log(this.adminService.products);
      this.router.navigateByUrl('admin-home/write-off-details');
    });
  }
}
