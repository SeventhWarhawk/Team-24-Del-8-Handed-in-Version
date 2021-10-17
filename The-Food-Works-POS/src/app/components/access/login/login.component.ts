import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/interfaces/report';
import { ReportService } from 'src/app/services/report/report.service';
import { UserService } from 'src/app/services/user.service';
import { CheckBranchComponent } from '../../modals/check-branch/check-branch.component';
import { RegisterComponentComponent } from '../register-component/register-component.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  admin = false;
  employee = false;
  isLogging = false;
  isFetching = false;
  roles: string[] = [];
  observeBranches: Observable<Branch[]> = this.serv.getBranches();
  tableData: any;
  selectionData: Branch[];
  branchDropdown: Branch = { BranchId: 0, BranchName: 'Centurion' };
  loginForm!: FormGroup;
  loginGroup: FormGroup = this.fb.group({
    EmailAddress: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    Password: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    BranchId: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private service: UserService, private serv: ReportService, private snack: MatSnackBar,
              private router: Router, private dialog: MatDialog,
              public dialogRef: MatDialogRef<CheckBranchComponent>, private CookieService: CookieService) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.observeBranches.subscribe(data => {
      this.selectionData = data;
      this.isFetching = false;
    }, (err: HttpErrorResponse) => {
      this.isFetching = false;
    });
  }

  Login(): void {
    this.isLogging = true;
    this.service.Login(this.loginGroup.value).subscribe(res => {
      // get User role --------- if Employee then proceed to Check Branch Dialog box
      // add cookies
      let employeeID = '';
      const tmpemployeeID = this.service.userInfo.employeeId?.toString();
      if (tmpemployeeID != null) {
        employeeID = tmpemployeeID;
      }
      this.CookieService.set('employeeId', employeeID);

      localStorage.setItem('user', JSON.stringify(this.service.userInfo.employeeId));

      // rather use this UserInfo in localstorage to get all the attributes, it's better than saving each member independently
      localStorage.setItem('userInfo', JSON.stringify(this.service.userInfo));

      console.log(res);
      localStorage.setItem('branch', JSON.stringify(this.branchDropdown.BranchId));
      // const bdy = res.body;
      // tslint:disable-next-line:no-non-null-assertion
      // this.service.user = bdy!;

      // route to home
      this.router.navigateByUrl('home');
      console.log(res);

      this.isLogging = false;
    }, (error: HttpErrorResponse) => {

      if (error.status === 404) {
        this.snack.open('Invalid credentials.', '', {
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
          duration: 2000
        });
        this.loginGroup.reset();
        this.isLogging = false;
        return;
      }
      this.snack.open('User Profile does not exist', '', {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
        duration: 2000
      });
      this.loginGroup.reset();
      this.isLogging = false;
    });
  }

}
