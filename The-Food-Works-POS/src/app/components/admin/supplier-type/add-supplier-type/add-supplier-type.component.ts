import { SupplierTypes } from './../../../../interfaces/supplier';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { SupplierService } from 'src/app/services/supplier.service';
@Component({
  selector: 'app-add-supplier-type',
  templateUrl: './add-supplier-type.component.html',
  styleUrls: ['./add-supplier-type.component.scss']
})
export class AddSupplierTypeComponent implements OnInit {


  toAddRole: SupplierTypes;
  constructor(private fb: FormBuilder, public dialog: MatDialog,
    private service: SupplierService,
    private snack: MatSnackBar, private router: Router, public dialogRef: MatDialogRef<AddSupplierTypeComponent>) { }
  addSupplierTypeForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
  }
  addSupplierType(formValue: any) {
    this.toAddRole = {
      SupplierTypeName: formValue.name,
    };
    this.service.addSupplierType(this.toAddRole).subscribe(res => {
      console.log(res);
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: false,
        data: {
          message: 'The Supplier Type details have been successfully added'
        }
      });

      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();
        window.location.reload();

      });
    }, (error: HttpErrorResponse) => {
      if (error.status === 400) {
        this.snack.open('This supplier type already exists!', 'OK', {
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          duration: 3000
        });
        this.dialogRef.close();
      }
    }
    );
  }
  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm Supplier Type Addition',
        message: 'Are you sure you would add this Supplier Type?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.addSupplierType(this.addSupplierTypeForm.value);
        console.log(this.addSupplierTypeForm.value);
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
