import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SuccessModalComponent } from '../../modals/success-modal/success-modal.component';

@Component({
  selector: 'app-forgot-otp',
  templateUrl: './forgot-otp.component.html',
  styleUrls: ['./forgot-otp.component.scss']
})
export class ForgotOTPComponent implements OnInit {

  OTPForm!: FormGroup;
  OTP: FormControl;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private snack: MatSnackBar, public userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.OTP = new FormControl('', [Validators.required]);
    this.OTPForm = this.fb.group({
      OTP: this.OTP
    });
  }

  checkOTP() {
    //var state = this.userService.CheckOTP(this.OTPForm.value).subscribe();

    this.userService.CheckOTP(this.OTPForm.value.OTP).subscribe(res => {
      this.router.navigateByUrl('reset-forgotten-password');
    }, (error) => {
      this.presentErrorMessage();
    });
  }

  presentErrorMessage() {
    this.snack.open('Incorrect OTP', '', {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar'],
      duration: 2000
    });
  }
}
