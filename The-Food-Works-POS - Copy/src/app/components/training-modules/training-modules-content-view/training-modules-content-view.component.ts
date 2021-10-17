import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Module } from 'src/app/interfaces/training';
import { TrainingService } from 'src/app/services/training/training.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmModalComponent } from './../../modals/confirm-modal/confirm-modal.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';


@Component({
  selector: 'app-training-modules-content-view',
  templateUrl: './training-modules-content-view.component.html',
  styleUrls: ['./training-modules-content-view.component.scss']
})
export class TrainingModulesContentViewComponent implements OnInit {

  safeSrc: SafeResourceUrl;
  isActive = true;
  generalForm: FormGroup;

  // State Declerations
  sentState: boolean;

  // General Declerations
  employeeId = localStorage['user'];
  trainingModuleInfo: Module[];
  moduleName: any;
  moduleDuration: any;
  contentOrder: any;
  passedId: any;
  viewMode: any;
  contentArray: any = [];
  html: any;

  // Content Bools
  videoContent: boolean;
  textContent: boolean;
  imageContent: boolean;
  imageArray: any = [];

  // Set Timer Variables
  tick: any;
  fullTime: any;
  subscription: Subscription;
  currentDate: any;

  constructor(private _sanitizer: DomSanitizer, public dialog: MatDialog, private route: ActivatedRoute, private service: TrainingService, private fb: FormBuilder, private router: Router) {
    this.passedId = this.route.snapshot.params['id'];
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {

    this.service.getTrainingModule(this.passedId, this.employeeId).subscribe(
      (resp: any) => {
        console.log(resp);
        this.trainingModuleInfo = resp;

        console.log(this.trainingModuleInfo[0].videoLink)

        // Get Module Name and Duration
        this.moduleName = this.trainingModuleInfo[0].ModuleName;
        this.moduleDuration = this.trainingModuleInfo[0].ModuleDuration;

        // Determine Module Viewing Mode (Viewed or Completed)
        this.viewMode = this.trainingModuleInfo[0].TrainingModuleCompleted;

        // Establish Content Order
        this.contentOrder = this.trainingModuleInfo[0].ContentOrder.replace(/,/g, ", ");
        this.contentArray = this.trainingModuleInfo[0].ContentOrder.split(',');
        console.log(this.contentArray);

        // Determine whether certain content areas exist
        this.videoContent = this.contentArray.includes('Video');
        this.textContent = this.contentArray.includes('Text');
        this.imageContent = this.contentArray.includes('Image')

        // Log Content Order
        console.log(this.videoContent + ',' + this.textContent + ',' + this.imageContent );

        // Join Image URL Array
        this.imageArray = this.trainingModuleInfo[0].imageContent.split(',');
        console.log(this.imageArray);

        //Set video URL (if any)
        if (this.videoContent) {
          var str = this.trainingModuleInfo[0].videoLink;
          var res = str.split("=");
          var embeddedUrl = "https://www.youtube.com/embed/" + res[1] + "?rel=0";
          this.safeSrc = this._sanitizer.bypassSecurityTrustResourceUrl(embeddedUrl);
        }
        else {
          // Do Nothing
        }
      },
      (error: any) => {
        console.log("Error");
      }
    )
  }

  beginModule() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Begin Training Module',
        message: 'Are you sure you want to begin ' + this.moduleName + '? This module is expected to take ' + this.moduleDuration + ' minutes'
      }
    });
    confirm.afterClosed().subscribe((res: any) => {
      if (res) {
        // Set module to begin mode
        this.moveToIndex(1);
        this.setNewState(true);
        // Start Completion Timer
        let time = timer(1000, 1000);
        this.subscription = time.subscribe(t => {
          this.tick = t;
        });
      }}, (error: HttpErrorResponse) => {
        console.log(error);
    });
  }

  endModule() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Complete Training Module Later',
        message: 'By choosing to finish the training module later, you forfeit your attempt and the module remains incomplete'
      }
    });
    confirm.afterClosed().subscribe((res: any) => {
      if (res) {
        // Set module to begin mode
        this.moveToIndex(0);
        this.setNewState(false);
        this.subscription.unsubscribe();
      }}, (error: HttpErrorResponse) => {
        console.log(error);
    });
  }

  completeModule() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Complete Training Module',
        message: 'By choosing to complete the training module, you submit your attempt. Note: Training modules such as this one can be viewed at any point after completion'
      }
    });
    confirm.afterClosed().subscribe((res: any) => {
      if (res) {
        // Set module to begin mode
        this.moveToIndex(2);
        this.setNewState(false);

        // End Completion Timer
        this.fullTime = new Date(this.tick * 1000).toISOString().substr(11, 8);
        this.currentDate = new Date();
        this.subscription.unsubscribe();

        // Set module to completed
        const completedModule = {
          moduleId: this.passedId,
          employeeId: this.employeeId,
          time: this.fullTime,
          date: this.currentDate
        }
        this.service.completeTrainingModule(completedModule).subscribe(
          (resp: any) => {
            console.log("Training Module Completed Successfully")
          },
          (error: any) => {
            console.log("Training Module Not Completed")
          }
        )
      }}, (error: HttpErrorResponse) => {
        console.log(error);
    });
  }

  // Move to tab
  moduleTabIndex = 0;
  moveToIndex(index: any) {
    this.moduleTabIndex = index;
  }

  // Send disabled state
  setNewState(state: boolean) {
    this.service.changeState(state);
  }

  moveToSelectedTab(tabName: string) {
    for (let i = 0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
}

function fetchData() {
  throw new Error('Function not implemented.');
}

