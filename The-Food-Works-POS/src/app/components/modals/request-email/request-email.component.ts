import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-request-email',
  templateUrl: './request-email.component.html',
  styleUrls: ['./request-email.component.scss']
})
export class RequestEmailComponent implements OnInit {

  emailForm: FormGroup;
  email: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<RequestEmailComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      emailAddress: [this.data.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]]
    });
  }

  onCancel()
  {
    this.dialogRef.close(false);
  }

  onConfirm()
  {
    this.dialogRef.close(this.emailForm.controls['emailAddress'].value);
  }

  public errorHandling = (control: string, error: string) => {
    return this.emailForm.controls[control].hasError(error);
  }
}
