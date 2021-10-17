import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generate-confirmation',
  templateUrl: './generate-confirmation.component.html',
  styleUrls: ['./generate-confirmation.component.scss']
})
export class GenerateConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GenerateConfirmationComponent>) { }

  ngOnInit(): void {
  }

}
