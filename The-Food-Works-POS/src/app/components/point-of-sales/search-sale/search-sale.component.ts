import { Sale } from './../../../interfaces/sale';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SaleService } from 'src/app/services/sale.service';

export interface PeriodicElement {
  saleID: string;
  dateOfSale: string;
  saleTotal: string;
}


@Component({
  selector: 'app-search-sale',
  templateUrl: './search-sale.component.html',
  styleUrls: ['./search-sale.component.scss']
})
export class SearchSaleComponent implements AfterViewInit {

  Sales: any;
  displayedColumns: string[] = ['saleID', 'dateOfSale','saleTotal', 'view'];
  dataSource = new MatTableDataSource<Sale>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private saleService: SaleService) { }

  ngAfterViewInit(): void {
    this.getAllSales();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllSales()
{
  this.saleService.getAllEmployees().subscribe(res =>{
    this.Sales = res;
    this.dataSource.data = this.Sales;

  })

}
}


