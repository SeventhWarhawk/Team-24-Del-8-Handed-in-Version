import { ProductServiceService } from './../../product-service.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  allProducts: any;
  mainProducts: any;
  sideProducts: any;
  dessertProducts: any;
  packageProducts: any;

  // Icon Declerations
  faFacebook = faFacebook;

  constructor(private service: ProductServiceService) { }

  ngOnInit(): void {
    this.getProducts();

    console.log(this.mainProducts);
  }

  getProducts() {
    this.service.getProducts().subscribe((resp: any) => {
      console.log(resp);
      this.allProducts = resp;
      this.mainProducts = this.allProducts.filter((x: any) => x.productTypeId ===  1);
      this.sideProducts = this.allProducts.filter((x: any) => x.productTypeId ===  5);
      this.dessertProducts = this.allProducts.filter((x: any) => x.productTypeId ===  4);
      this.packageProducts = this.allProducts.filter((x: any) => x.productTypeId ===  3);
    }, (error: any) => {
      console.log("Unable to get products!");
    })
  }

}
