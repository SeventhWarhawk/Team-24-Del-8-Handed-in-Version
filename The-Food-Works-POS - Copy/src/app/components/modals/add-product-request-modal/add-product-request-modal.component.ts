import { BranchService } from './../../../services/branch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { BranchProduct } from 'src/app/interfaces/branch';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-request-modal',
  templateUrl: './add-product-request-modal.component.html',
  styleUrls: ['./add-product-request-modal.component.scss']
})
export class AddProductRequestModalComponent implements OnInit {

  // Initialize Form
  addProductForm: FormGroup;

  // Initialize Branch Id
  branchId = localStorage['branch'];

  // Initialize Products (for Autocomplete)
  products: any;
  filteredProducts: any;
  branchProduct: BranchProduct[];

  constructor(private fb: FormBuilder, private branchService: BranchService, public dialogRef: MatDialogRef<AddProductRequestModalComponent>) { }

  ngOnInit(): void {
    this.getProductNames();
    this.addProductReactiveForm();
  }

  // Create reactive form
  addProductReactiveForm() {
    this.addProductForm = this.fb.group({
      // Product Drop Down
      'product' : ['', Validators.compose([Validators.required])],
      // Quantity Selection
      'quantity' : ['', Validators.compose([Validators.required])]
    })
    this.addProductForm.get('product')?.valueChanges.subscribe(resp => {
      this.filterData(resp);
    })
  }

  // Autocomplete Population Functions (w/Validation)
  filterData(enteredData: any) {
    this.filteredProducts = this.products.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1;
    })
  }

  getProductNames() {
    console.log(this.branchId)
    this.branchService.getProductRequestNames(this.branchId).subscribe(resp => {
      this.products = resp;
      this.filteredProducts = resp;
    })
  }

  productClick(event: any) {
    this.products = event.option.value;
  }

  checkProduct() {
    setTimeout(()=> {
     if (!this.products || this.products !== this.addProductForm.controls['product'].value) {
       this.addProductForm.controls['product'].setValue(null);
       this.products = '';
     }
    }, 100);
   }

   // Send Product Name Selected to "GetProductByName" endpoint and assign variable to observable returned
   getProductByName() {
      const productName = this.addProductForm.get('product')?.value;
      const quantity = this.addProductForm.get('quantity')?.value;
      this.branchService.getProductByName(productName).subscribe((resp: any) => {
      this.branchProduct = resp;
      this.branchProduct[0].RequestedQuantity = quantity;
      this.branchProduct[0].EnteredQuantity = quantity;
      this.branchProduct[0].CanDelete = true;
      this.branchProduct[0].Confirmed = false;
      this.dialogRef.close(this.branchProduct)
    })
   }

}
