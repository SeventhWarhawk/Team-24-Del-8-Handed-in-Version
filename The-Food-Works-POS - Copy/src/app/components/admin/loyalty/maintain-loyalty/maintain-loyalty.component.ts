import { LoyaltyVideoDialogComponent } from './../loyalty-video-dialog/loyalty-video-dialog.component';
import { LoyaltySettingsDialogComponent } from './../loyalty-settings-dialog/loyalty-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Branch } from 'src/app/interfaces/branch';

@Component({
  selector: 'app-maintain-loyalty',
  templateUrl: './maintain-loyalty.component.html',
  styleUrls: ['./maintain-loyalty.component.scss']
})
export class MaintainLoyaltyComponent implements OnInit {

  // Initialize Loyalty Customers Table
  displayedColumns: string[] = ['customerId', 'customerName', 'customerSurname', 'customerTelephone', 'customerEmail', 'dateJoined', 'customerDob'];
  public dataSource: MatTableDataSource<any>;
  loadingMode: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataArray: any;

  constructor(private service: LoyaltyService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadingMode = 'query';
    this.service.getLoyaltyCustomers().subscribe(response => {
      console.log(response);
      this.dataArray = response;
      this.dataSource = new MatTableDataSource<any>(this.dataArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingMode = 'determinate';
    }, error => {
      console.log("Unable to load loyalty customers")
      this.loadingMode = 'determinate';
    });
  }

  // Search filter for Maintain Branch table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Open Settings
  openSettingsDialog() {
    this.loadingMode = 'query';
    this.service.getLoyaltyPercentage().subscribe((resp: any) => {
      const dialogRef = this.dialog.open(LoyaltySettingsDialogComponent, {
        data: resp
      });
      this.loadingMode = 'determinate',
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }, (error: any) => {
      console.log("Unable to retrieve loyalty percentage")
    })
  }

  // Open Loyalty Help Video
  openVideoDialog() {
    const dialogRef = this.dialog.open(LoyaltyVideoDialogComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  generateVouchers() {
    this.service.generateVouchers().subscribe(result => {
      console.log('Vouchers Added');
    }, error => {
      console.log('Vouchers Not Added');
    });
  }

}
