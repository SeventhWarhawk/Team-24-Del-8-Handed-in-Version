import { ModuleType } from './../../../../interfaces/training';
import { Component, Inject, OnInit } from '@angular/core';
import { TrainingService } from 'src/app/services/training/training.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-update-training-module-type',
  templateUrl: './update-training-module-type.component.html',
  styleUrls: ['./update-training-module-type.component.scss']
})
export class UpdateTrainingModuleTypeComponent implements OnInit {

  toUpdateType: ModuleType;
  types: any;
   constructor(private service: TrainingService, @Inject(MAT_DIALOG_DATA) public data: ModuleType,
               public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateTrainingModuleTypeComponent>) { }

  form: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.getTypes();
    this.form.patchValue({
      description: this.data.Description,
    });
  }
  getTypes()
  {
    this.service.getAllTypes().subscribe(res => {
      this.types = res;
      console.log(res);
    });
  }

  updateType(formValue: any) {
    this.toUpdateType =
    {
      ID: this.data.ID,
      Description: formValue.description
    };
    this.service.updateType(this.toUpdateType).subscribe(res => {
      console.log(res);
      window.location.reload();
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: true,
        data: {
          message: 'The Training module type has been successfully updated'
        }
      });
      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();
        window.location.reload();

      });
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Training Module Type Update',
        message: 'Are you sure you would update this training module type?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res)
      {
        console.log('hi');
        this.updateType(this.form.value);
      }
      else
      {
        console.log('BAD');
      }
    });


  }
}

