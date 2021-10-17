import { ModuleType } from './../../../../interfaces/training';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrainingService } from 'src/app/services/training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-create-training-module-type',
  templateUrl: './create-training-module-type.component.html',
  styleUrls: ['./create-training-module-type.component.scss']
})
export class CreateTrainingModuleTypeComponent implements OnInit {
  toAddRole: ModuleType;
  constructor(private fb: FormBuilder, public dialog: MatDialog,
    private service: TrainingService,
    private snack: MatSnackBar, private router: Router, public dialogRef: MatDialogRef<CreateTrainingModuleTypeComponent>) { }

  addTypeForm: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
  }
  addType(formValue: any) {
    this.service.addType(formValue).subscribe(res => {
      console.log(res);
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: true,
        data: {
          message: 'The new Training Module Type has been successfully created'
        }
      });
      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();
        this.router.navigateByUrl('/admin/maintain-training-module-type');
      });
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Training Module Type Addition',
        message: 'Are you sure you would add this training module type?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log(this.addTypeForm.value);
        this.addType(this.addTypeForm.value);
      }
      else {
        console.log('BAD');
      }
    });


  }

}
