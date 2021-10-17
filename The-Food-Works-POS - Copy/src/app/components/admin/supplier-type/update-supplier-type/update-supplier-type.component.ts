import { SupplierTypes } from './../../../../interfaces/supplier';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SupplierService } from 'src/app/services/supplier.service';


@Component({
  selector: 'app-update-supplier-type',
  templateUrl: './update-supplier-type.component.html',
  styleUrls: ['./update-supplier-type.component.scss']
})
export class UpdateSupplierTypeComponent implements OnInit {

  toUpdateRole: SupplierTypes;
  SupplierTypes: any;

  constructor(private SupplierService: SupplierService, @Inject(MAT_DIALOG_DATA) public data: SupplierTypes,
    public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateSupplierTypeComponent>) { }

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  ngOnInit(): void {
    this.getSupplierTypes();
    this.form.patchValue({
      name: this.data.SupplierTypeName,
    });
  }
  getSupplierTypes() {
    this.SupplierService.getAllSupplierTypes().subscribe(res => {
      this.SupplierTypes = res;
    });
  }

  updateSupplierType(formValue: any) {
    this.toUpdateRole =
    {
      SupplierTypeId: this.data.SupplierTypeId,
      SupplierTypeName: formValue.name,
    };
    console.log(this.toUpdateRole);
    this.SupplierService.updateSupplierType(this.toUpdateRole).subscribe(res => {
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: false,
        data: {
          message: 'The Supplier Type details have been successfully updated'
        }
      });
      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();
        window.location.reload();

      });
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Supplier Type Update',
        message: 'Are you sure you would update this Supplier type?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.updateSupplierType(this.form.value);
      }
      else {
        console.log('BAD');
      }
    });
  }

  onCancel()
  {
    this.dialogRef.close();
  }
}
