import { AdminService } from './../../../../services/admin/admin.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRole } from 'src/app/interfaces/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-update-user-role',
  templateUrl: './update-user-role.component.html',
  styleUrls: ['./update-user-role.component.scss']
})
export class UpdateUserRoleComponent implements OnInit {

  updateUserRoleForm!: FormGroup;
  toUpdateRole: UserRole;
  userRoles: any;
  contentList: string[] = ["Admin", "Backup", "Branch", "Customer", "Customer Order", "Delivery", "Employee", "Loyalty", "Manufacturing", "Product", "Supplier", "Supplier Order", "Training",];
  temp: string;


  selectedContents: any;
  currentAccess: any

  constructor(private adminService: AdminService, @Inject(MAT_DIALOG_DATA) public data: UserRole,
    public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateUserRoleComponent>) { }

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    // description: new FormArray([], Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.getUserRoles();
    this.form.patchValue({
      name: this.data.name,
      description: this.data.description,
    });

    this.currentAccess = this.data.description.split(',');
    console.log(this.currentAccess);

    this.selectedContents = this.currentAccess;

  }

  getUserRoles() {
    this.adminService.getAllUserRoles().subscribe(res => {
      this.userRoles = res;
    });
  }

  updateUserRole(formValue: any) {
    this.selectedContents == this.currentAccess;
    console.log(this.selectedContents)
    this.toUpdateRole =
    {
      ID: this.data.ID,
      name: formValue.name,
      description: this.selectedContents.toString(),
    };
    console.log(this.toUpdateRole);
    this.adminService.updateUserRole(this.toUpdateRole).subscribe(res => {
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: false,
        data: {
          message: 'The User Role details have been successfully updated'
        }
      });
      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();

      });
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm User Role Update',
        message: 'Are you sure you want to update this user role?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.updateUserRole(this.form.value);
      }
      else {
        console.log('BAD');
      }
    });
  }

  change(event: any) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);

      if (event.source.selected == false) {
        console.log("This is false ", event.source.value)

        this.currentAccess.forEach((value: string, index: any) => {
          console.log("Value of contentlist", value);
          this.temp = value;
          if (this.temp == event.source.value) {
            this.currentAccess.splice(index, 1);
          }
        });

      }
      else {
        console.log("This is true ", event.source.value)
        this.currentAccess.push(event.source.value);
        console.log("This is testing ", this.currentAccess)
      }
    }
  }

}
