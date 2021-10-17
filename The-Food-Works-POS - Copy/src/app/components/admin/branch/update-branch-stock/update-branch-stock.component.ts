import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRole } from 'src/app/interfaces/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { BranchProduct, BranchProductUpdate } from 'src/app/interfaces/branch';
import { BranchService } from 'src/app/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-branch-stock',
  templateUrl: './update-branch-stock.component.html',
  styleUrls: ['./update-branch-stock.component.scss']
})
export class UpdateBranchStockComponent implements OnInit {

  toUpdateRole: BranchProductUpdate;
  ingredient = false;
  constructor(private branchService: BranchService, @Inject(MAT_DIALOG_DATA) public data: BranchProductUpdate,
    public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateBranchStockComponent>, private snackBar: MatSnackBar) { }

  form: FormGroup = new FormGroup({
    ProductId: new FormControl('', Validators.required),
    BaselineQuantity: new FormControl('', [Validators.required, Validators.min(0)]),
    ProductPrice: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    if (this.data.productPrice == 0 || this.data.productPrice == null) {
      this.ingredient = true;
    }
    this.form.patchValue({
      ProductId: this.data.productId,
      ProductPrice: this.data.productPrice,
      BaselineQuantity: this.data.baselineQuantity,
    });
  }

  updateBP(formValue: any) {
    this.toUpdateRole =
    {
      branchId: JSON.parse(localStorage.getItem('branch')!),
      productId: this.data.productId,
      productPrice: formValue.ProductPrice,
      baselineQuantity: formValue.BaselineQuantity,

    };
    console.log(this.toUpdateRole);
    this.branchService.updateBranchProduct(this.toUpdateRole).subscribe(res => {
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: false,
        data: {
          message: 'The Branch Product details have been successfully updated'
        }
      });
      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();

      });
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm Branch Product Update',
        message: 'Are you sure you want to update this product?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.updateBP(this.form.value);
      }
      else {
        console.log('BAD');
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
