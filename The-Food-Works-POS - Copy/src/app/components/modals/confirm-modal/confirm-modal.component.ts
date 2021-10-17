import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  heading = this.data.heading;
  message = this.data.message;

  constructor(@Inject (MAT_DIALOG_DATA) public data: {heading: string, message: string}, private dialogRef: MatDialogRef<ConfirmModalComponent>) { }

  ngOnInit(): void {
  }

  onCancel()
  {
    this.dialogRef.close(false);
  }

  onConfirm()
  {
    this.dialogRef.close(true);
  }
}
