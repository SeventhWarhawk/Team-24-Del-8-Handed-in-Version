import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusinessRule } from 'src/app/interfaces/admin';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from '../../modals/success-modal/success-modal.component';

@Component({
  selector: 'app-adjust-business-rules',
  templateUrl: './adjust-business-rules.component.html',
  styleUrls: ['./adjust-business-rules.component.scss']
})
export class AdjustBusinessRulesComponent implements OnInit {

  rules: BusinessRule;
  vatForm: FormGroup;
  timerForm: FormGroup;
  currentTime: any;

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private formBuilder: FormBuilder, public router: Router,
              private adminService: AdminService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.vatForm = this.fb.group({
      vat: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
        // tslint:disable-next-line: quotemark
        Validators.pattern("^[0-9]*$")]
      ]
    });

    this.timerForm = this.fb.group({
      paymentTimer: ['', [
        Validators.required,
        // tslint:disable-next-line: quotemark
        Validators.pattern("^[0-9]*$")]
      ]
    });

    this.currentTime = localStorage.getItem('paymentTimer');
  }

  openDialog() {
    this.rules = this.vatForm.value;
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Update of Business Rules',
        message: 'Are you sure you would like to update the VAT amount?'
      }
    });
    confirm.afterClosed().subscribe(r => {
      if (r) {
        console.log(this.rules);
        this.adminService.adjustBusinessRules(this.rules).subscribe(res => {

          console.log('This is a res test - check success modal', res);
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              heading: 'Rules Successfully Adjusted',
              message: 'New VAT values have been saved'
            }
          });

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.router.navigateByUrl('admin-home');
          });
        },
          (error: HttpErrorResponse) => {
            console.log(error)
            if (error.status === 400) {
              console.log('ERROR')
              this._snackBar.open('An error occured on the server. Please try again later.', "OK");
            }
          });
      }
    });
  }

  updateTimer() {
    localStorage.setItem('paymentTimer', this.currentTime);
    this.displaySuccessMessage('Succes! Payment timer adjusted.');
  }

  displaySuccessMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }
}
