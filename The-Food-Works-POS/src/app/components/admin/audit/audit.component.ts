import { Component, ViewChild, AfterViewInit, OnInit, NgModule } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchProduct, Product } from 'src/app/interfaces/admin';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Audit } from 'src/app/interfaces/audit';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuditComponent implements OnInit {

  constructor(public adminService: AdminService, public dialog: MatDialog, private router: Router) { }
  temp: number[] = [];
  created = false;
  viewProduct: any;
  Products: any;
  branchData: any;
  displayedColumns: string[] = ['ID', 'ERROR', 'TIMESTAMP', 'ACTION', 'CONTROLLER', 'REQUEST BODY'];
  dataSource = new MatTableDataSource<Audit>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  expandedElement: null;

  ngOnInit() {
    this.getAllAudits();
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

  getAllAudits() {
    this.loadingMode = 'query';
    this.adminService.getAudits().subscribe(res => {
      this.branchData = res;
      this.dataSource.data = this.branchData;
      console.log(res);
      this.loadingMode = 'determinate';
    });
    this.created = true;
  }

}

