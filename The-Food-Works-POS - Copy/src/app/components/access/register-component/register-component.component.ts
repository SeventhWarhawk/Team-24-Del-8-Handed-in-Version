import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.scss']
})
export class RegisterComponentComponent implements OnInit {
  form: FormGroup = this.fb.group({
    Name: ['', Validators.email],
    Surname: ['', Validators.email],
    DOB: ['', Validators.email],
    Tel: ['', Validators.email],
    EmailAddress: ['', Validators.email],
    Password: ['', Validators.required],
    Loyalty: ['', Validators.required],
  });
  constructor(private service: UserService, private fb: FormBuilder,
              private dialogRef: MatDialogRef<RegisterComponentComponent>, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  Register() {
    this.service.Register(this.form.value).subscribe(res => {
      this.dialogRef.close();
      this.snack.open('Successful registration', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000
      });
    }, (error: HttpErrorResponse) => {
      if (error.status === 403) {
        this.snack.open('This user has already been registered.', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000
        });
      }
      this.snack.open('An error occurred on our servers, try again', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000
      });
      this.dialogRef.close();
    });
  }

}



