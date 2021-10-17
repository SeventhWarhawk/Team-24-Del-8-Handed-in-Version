import { User, UserInfo } from './../../../interfaces/user';
import { RedeemVoucherComponent } from './../../loyalty/redeem-voucher/redeem-voucher.component';
import { ViewLoyaltyPointsComponent } from './../../loyalty/view-loyalty-points/view-loyalty-points.component';
import { AddLoyaltyMemberComponent } from './../../loyalty/add-loyalty-member/add-loyalty-member.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  admin = false;
  employee = false;
  roles: string[] = [];
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  constructor(public dialog: MatDialog, private router: Router, public userService: UserService, public branchService: BranchService, private snack: MatSnackBar) {
    this.svc = userService;
    this.userName = this.userInfo.displayName;
    this.roles = this.userInfo.roles;
  }
  userName = '';
  displayName = '';
  svc: any;
  branch = 'loading...';



  ngOnInit(): void {
    this.getBranchName();
    this.roles = this.userInfo.roles;
    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == "Admin") {
        this.admin = true;
      }
      if (this.roles[i] == "Employee") {
        this.employee = true;
      }
    }
    if (this.employee || this.admin) {
      this.userService.generateNotification().subscribe(sb => {
        if (sb != null && this.employee) {
          console.log(this.employee);

          this.snack.open(sb.notification.toString(), 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          })
        }
      })
    }
  }

  goToHelp() {
    window.open("http://localhost:8080/Genpoint%20System%20Help.html");
  }

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

  getBranchName() {
    const branchId = JSON.parse(localStorage.getItem('branch')!);
    return this.branchService.getBranchName(branchId)
      .subscribe((res: any) => {
        this.branch = res.branchName;

      });
  }



  // Add Loyalty Member Dialog
  openDialog() {
    this.dialog.open(RedeemVoucherComponent);
  }

  onClick() {
    this.router.navigateByUrl('admin/maintain-supplier');
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
}
