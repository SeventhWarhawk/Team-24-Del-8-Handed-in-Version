import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import html2canvas from 'html2canvas';
import { MatDatepickerModule } from '@angular/material/datepicker';
import jsPDF from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
  selector: 'app-reporting-home',
  templateUrl: './reporting-home.component.html',
  styleUrls: ['./reporting-home.component.scss']
})
export class ReportingHomeComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  constructor(private fb: FormBuilder, private http: HttpClient, private service: ReportService, public dialog: MatDialog,
    private router: Router, public userService: UserService, private snack: MatSnackBar) {
    this.svc = userService;
    this.userName = this.userInfo.displayName;
  }
  redirect() {
    console.log('busy');
    this.router.navigateByUrl('reset-password');
  }
  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Leaving already?',
        message: 'Are you sure you want to log out?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.userService.Logout().subscribe(r => {
          console.log(r);
          this.router.navigateByUrl('/login');
        }, (error: HttpErrorResponse) => {
          this.snack.open('Tasks pending completion - you may not log out.', 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: 3000
          });
        });
      }
    });
  }

  // NAVBAR REQUIREMENTS
  userName = '';
  displayName = '';
  svc: any;

  getUserName() {
    if (this.userName == null || undefined) {
      this.router.navigateByUrl('login');
      return 'dummy';
    }
    else if (this.userName != null) {
      return this.userName!;
    }
    else
      return this.svc.userInfo.displayName;
  }

  // --------------
  ngOnInit() {
  }
}
