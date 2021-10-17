import { FormBuilder, FormGroup } from '@angular/forms';
import { loyaltyDialogData } from './../../../../interfaces/loyalty';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';

@Component({
  selector: 'app-loyalty-settings-dialog',
  templateUrl: './loyalty-settings-dialog.component.html',
  styleUrls: ['./loyalty-settings-dialog.component.scss']
})
export class LoyaltySettingsDialogComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private service: LoyaltyService, @Inject(MAT_DIALOG_DATA) public data: loyaltyDialogData, public dialogRef: MatDialogRef<LoyaltySettingsDialogComponent>, private fb: FormBuilder,) { }

  percentageForm: FormGroup;
  currentPercentage: any;
  livePercentage: any;
  flag: boolean;

  ngOnInit(): void {
    this.livePercentage = this.data;
    this.currentPercentage = this.data.LoyaltyPercentageAmount;
    this.percentageForm = this.fb.group({
      percentage: [this.livePercentage]
    })
    this.flag = false;
  }

  adjustFlag(event: any) {
    console.log(this.livePercentage)
    if(this.livePercentage == null) {
      this.flag = true;
    } else {
      this.flag = false;
    }
    event.preventDefault();
  }

  applySettings() {
    let newPercentage = this.percentageForm.controls['percentage'].value;
    this.service.updateLoyaltyPercentage(newPercentage).subscribe((resp: any) => {
      console.log("Percentage updated successfully")
      this.displaySuccessMessage("Loyalty Percentage Updated Successfully")
      this.dialogRef.close();
    }, (error: any) => {
      console.log("Percentage not updated")
      this.displayErrorMessage("Unable to Update Loyalty Percentage")
    })
  }

  displaySuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['success-snackbar']
    });
  }

  displayErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }

}
