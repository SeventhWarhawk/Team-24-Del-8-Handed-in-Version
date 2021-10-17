import { UpdateProductComponent } from './../update-product/update-product.component';
import { ProductService } from './../../../../services/product.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Product, ProductTypes } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-maintain-product',
  templateUrl: './maintain-product.component.html',
  styleUrls: ['./maintain-product.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaintainProductComponent implements AfterViewInit {

  Products: any;
  loadingMode: any;

  displayedColumns: string[] = ['productBarcode', 'productName', 'productDescription', 'productType', 'productImage', 'inventoryProduct', 'update', 'delete'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  expandedElement: null;

  constructor(private ProductService: ProductService, private snack: MatSnackBar, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  observeTypes: Observable<ProductTypes[]> = this.ProductService.getproductTypes();
  typesData: ProductTypes[];
  selectedOption: number;

  ngOnInit(): void {
    this.loadingMode = 'query';
    this.observeTypes.subscribe(data => {
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    this.selectedOption = 1;
    this.getProducts(this.selectedOption);

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //all products (based on type)
  getProducts(selected: number) {
    if (selected == 1) {
      this.ProductService.getProducts().subscribe(res => {
        this.Products = res;
        //add 'data' in order to filter
        this.dataSource.data = this.Products;
        this.loadingMode = 'determinate';
      })
    }
    else if (selected == 2) {
      this.ProductService.getIngredients().subscribe(res => {
        this.Products = res;
        console.log(this.Products);
        //add 'data' in order to filter
        this.dataSource.data = this.Products;

      })
    }
    else if (selected == 3) {
      this.ProductService.getPackages().subscribe(res => {
        this.Products = res;
        console.log(this.Products);
        //add 'data' in order to filter
        this.dataSource.data = this.Products;

      })
    }
    else if (selected == 4) {
      this.ProductService.getDesserts().subscribe(res => {
        this.Products = res;
        console.log(this.Products);
        //add 'data' in order to filter
        this.dataSource.data = this.Products;

      })
    }
    else if (selected == 5) {
      this.ProductService.getSides().subscribe(res => {
        this.Products = res;
        console.log(this.Products);
        //add 'data' in order to filter
        this.dataSource.data = this.Products;
      })
    }
  }

  //For Update
  viewProductUpdate: any;
  getOneProduct(ProductName: string) {
    return this.ProductService.getOneProduct(ProductName).subscribe(res => {
      this.viewProductUpdate = res;
      console.log("View Product Update ", this.viewProductUpdate)
      const dialogRef = this.dialog.open(UpdateProductComponent, {
        disableClose: true,
        width: '1300px',
        height: '460px',
        data: {
          ProductId: this.viewProductUpdate.productId,
          ProductName: this.viewProductUpdate.productName,
          ProductBarcode: this.viewProductUpdate.productBarcode,
          ProductDescription: this.viewProductUpdate.productDescription,
          ProductImage: this.viewProductUpdate.productImage,
          ProductNames: this.viewProductUpdate.productNames,
          Quantities: this.viewProductUpdate.quantities,
          ProductTypeId: this.viewProductUpdate.productTypeId,
          ProductStatusId: this.viewProductUpdate.productStatusId,
          contents: this.viewProductUpdate.contents
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });


    });
  }

  //------------delete product ----------
  deleteProduct(ProductId: number) {
    console.log(ProductId);
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm Product Deletion',
        message: 'Are you sure you want to delete this product?'
      }
    });
    confirm.afterClosed().subscribe(r => {
      if (r) {
        this.ProductService.deleteProduct(ProductId).subscribe(o => {
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: false,
            data: {
              heading: 'Successful Product Deletion',
              message: 'The selected product was successfully deleted'
            }
          })
          this.ngOnInit();
        }, (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.snack.open('You may not delete this product right now!', 'OK', {
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              duration: 3000
            });
          }
        });
      }
    });
  }
}
