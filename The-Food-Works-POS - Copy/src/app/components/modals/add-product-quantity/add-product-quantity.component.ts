import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-quantity',
  templateUrl: './add-product-quantity.component.html',
  styleUrls: ['./add-product-quantity.component.scss']
})
export class AddProductQuantityComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddProductQuantityComponent>, @Inject(MAT_DIALOG_DATA) public data: number) { }

  form: FormGroup = new FormGroup({
    Quantity: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(100)]),
    });

  ngOnInit(): void {
  }

  onCancel()
  {
    this.dialogRef.close(false);
  }

  onConfirm()
  {
    this.dialogRef.close({data: this.form.value});
  }

}
