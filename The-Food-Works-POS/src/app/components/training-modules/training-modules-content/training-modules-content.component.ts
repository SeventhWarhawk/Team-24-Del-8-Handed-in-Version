import { ConfirmModalComponent } from './../../modals/confirm-modal/confirm-modal.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-training-modules-content',
  templateUrl: './training-modules-content.component.html',
  styleUrls: ['./training-modules-content.component.scss']
})
export class TrainingModulesContentComponent implements OnInit {

  safeSrc: SafeResourceUrl;
  isActive = true;

  constructor(private _sanitizer: DomSanitizer, public dialog: MatDialog) {
    this.safeSrc = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/1BEWYpBeN94");
  }

  ngOnInit(): void {

  }

  openDialog() {
    this.dialog.open(ConfirmModalComponent);
  }

  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }



}
