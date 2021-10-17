import { User } from './../../../interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessModalComponent } from '../../modals/success-modal/success-modal.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  currentPassword: FormControl;
  email: FormControl;
  newPassword: FormControl;
  confirmPassword: FormControl;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ResetPasswordComponent>,
    private fb: FormBuilder, private userService: UserService, private snack: MatSnackBar, private router: Router) { }
  ngOnInit(): void {
    // Initialize Controls
    this.currentPassword = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required]);
    this.newPassword = new FormControl('', [Validators.required, Validators.minLength(6)]),
      this.confirmPassword = new FormControl('', [Validators.required, Validators.minLength(6)]),

      this.resetPasswordForm = this.fb.group({
        email: this.email,
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      });
  }

  ResetForgottenPassword() {
    if (this.userService.MustMatch(this.resetPasswordForm.value)) {
      this.userService.ResetPassword(this.resetPasswordForm.value).subscribe(res => {
        // route to login
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            message: 'Your Password has been successfully Reset'
          }
        });
        success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.dialogRef.close();
          window.location.reload();

        });
        this.router.navigateByUrl('login');
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.snack.open('Invalid current password.', 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: 3000
          });
          return;
        }
        if (error.status === 400) {
          this.snack.open('Invalid current password.', 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: 3000
          });
          return;
        }
        this.resetPasswordForm.reset();
      });
    }
    else {
      this.snack.open('Passwords must match!', 'OK', {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        duration: 3000
      });
    }
  }
  // ngOnInit(): void {
  //   this.model.token = this.route.snapshot.queryParamMap.get('token');
  //   this.model.UserID = this.route.snapshot.queryParamMap.get('userid');
  //   this.resetForm = this.fb.group({
  //     password: [''],
  //     confirmPassword: ['']
  //   });
  // }

  onSubmit() {
    this.userService.ResetPassword(this.resetPasswordForm.value).subscribe(() => {
      console.log('success');
    }, error => {
      console.log('error');
    });
  }

}
