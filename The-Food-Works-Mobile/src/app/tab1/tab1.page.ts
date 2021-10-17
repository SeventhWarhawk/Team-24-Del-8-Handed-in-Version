import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { IProductMenuItem } from '../interfaces/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  products: IProductMenuItem[];
  filterProducts: IProductMenuItem[];
  isFetching = false;
  branchID: number;
  filterTerm: string;

  constructor(private service: CustomerService, private router: Router) {}

  ngOnInit() {
    this.service.getAllProducts().subscribe((data: any) => {
      this.products = data;
      this.filterProducts = data;
      this.isFetching = false;
    });
    this.isFetching = true;
  }

  filter(filterParam: any) {
    if (filterParam !== 'all') {
      this.filterProducts = this.products.filter(zz => zz.productType === filterParam);
    } else {
      this.filterProducts = this.products;
    }
  }

  onClick(productID: number) {
    this.service.setProductID(productID);
    this.router.navigate(['/view-product']);
  }
}
