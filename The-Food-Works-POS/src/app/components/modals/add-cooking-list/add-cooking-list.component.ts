import { MatSnackBar } from '@angular/material/snack-bar';
import { DataLayerManager } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';


@Component({
  selector: 'app-add-cooking-list',
  templateUrl: './add-cooking-list.component.html',
  styleUrls: ['./add-cooking-list.component.scss']
})
export class AddCookingListComponent implements OnInit {

  date: Date;
  minDate = Date.now;
  constructor(private dialogRef: MatDialogRef<AddCookingListComponent>, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }



  onCancel() {
    this.dialogRef.close(false);
  }

  month: any;
  onConfirm(date: Date) {


    this.dialogRef.close(date);
  }

  validate(date: Date) {
    var todaysDate = new Date();
    console.log(date)
    if (date.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
      this._snackBar.open('Sorry, you cannot select a date from the past', 'OK');
      date = todaysDate;
    }
  }

}
