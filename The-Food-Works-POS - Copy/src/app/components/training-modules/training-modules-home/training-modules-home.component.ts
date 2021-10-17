import { TrainingService } from 'src/app/services/training/training.service';
import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/interfaces/training';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-training-modules-home',
  templateUrl: './training-modules-home.component.html',
  styleUrls: ['./training-modules-home.component.scss']
})
export class TrainingModulesHomeComponent implements OnInit {

  // General Declerations
  moduleList: Module[];
  employeeId = localStorage['user'];
  progress: any;
  loading: any;

  // Declare State
  sentState: any;

  panelOpenState = false;
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  constructor(private service: TrainingService, public dialog: MatDialog, private router: Router, public userService: UserService, private snack: MatSnackBar) {
    this.svc = userService;
    // tslint:disable-next-line:no-non-null-assertion
    this.userName = this.userInfo.displayName;
    this.branch = userService.userInfo.branchName;
  }

  userName = '';
  displayName = '';
  svc: any;
  branch = '';

  ngOnInit() {
    this.loading = true;
    this.service.getTrainingModuleList(this.employeeId).subscribe(
      (resp: any) => {
        console.log(resp)
        this.moduleList = resp;
        this.loading = false;
        this.setProgress()
      },
      (error: any) => {
        this.loading = false;
        console.log("Unable to receive data")
      }
    )
    this.service.state.subscribe((resp: any) => this.sentState = resp)
  }

  checkState() {

    alert(this.sentState)
  }

  setProgress() {
    let total = this.moduleList.length;
    let completed = 0;
    for (let i = 0; i < total; i++) {
      if (this.moduleList[i].TrainingModuleCompleted == true) {
        completed++;
      }
    }
    let progress = (completed * 100) / total;
    console.log(progress);
    this.progress = progress;
  }

  getUserName() {
    if (this.displayName == null || undefined) {
      this.router.navigateByUrl('login');
      return 'dummy';
    }
    else if (this.displayName != null) {
      return this.displayName!;
    }
    else
      return this.svc.userInfo.displayName;
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
    confirm.afterClosed().subscribe((res: any) => {
      if (res) {
        console.log('hi');
        this.userService.Logout().subscribe((r: any) => {
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
