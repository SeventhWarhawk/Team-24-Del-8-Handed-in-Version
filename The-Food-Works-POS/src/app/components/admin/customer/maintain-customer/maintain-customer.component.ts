import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  name: string;
  surname: string;
  DOB: string;
  telephone: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Jane', surname: 'Smit', DOB: '12/05/1997', telephone:'0824578912'},
  {name: 'Phillip', surname: 'Johnson', DOB: '21/10/1969', telephone:'0834785215'},
  {name: 'Bella', surname: 'Williams', DOB: '02/04/1987', telephone:'0659135782'},
  {name: 'Tyson', surname: 'Brown', DOB: '09/08/1957', telephone:'0637824918'},
  {name: 'Layla', surname: 'Jomes', DOB: '22/06/1978', telephone:'0714567532'},
  {name: 'Dexter', surname: 'Garcia', DOB: '02/02/1985', telephone:'0812457962'},
  {name: 'Elijah', surname: 'Miller', DOB: '20/07/1996', telephone:'0610890347'},
  {name: 'Olivia', surname: 'Davis', DOB: '01/02/1993', telephone:'0846056236'},
  {name: 'Ila', surname: 'Tayor', DOB: '08/12/1989', telephone:'0834697258'},
  {name: 'Jack', surname: 'Anderson', DOB: '10/03/1976', telephone:'0648720541'},
];

@Component({
  selector: 'app-maintain-customer',
  templateUrl: './maintain-customer.component.html',
  styleUrls: ['./maintain-customer.component.scss']
})
export class MaintainCustomerComponent implements AfterViewInit {

  displayedColumns: string[] = ['fullname', 'DOB', 'telephone', 'update'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
