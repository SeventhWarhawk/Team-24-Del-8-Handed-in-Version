import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { UserRole } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin/admin.service';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  toAddRole: UserRole;
  contentList: string[] = ["Admin", "Branch", "Supplier Order", "Customer", "Employee", "Delivery", "Customer Order", "Supplier", "Backup", "Training", "Manufacturing", "Product", "Loyalty"];
  selectedContents: any;
  constructor(private fb: FormBuilder, public dialog: MatDialog,
    private service: AdminService,
    private snack: MatSnackBar, private router: Router, public dialogRef: MatDialogRef<AddUserComponent>) { }
  addUserRoleForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
  }
  addUserRole(formValue: any) {
    this.toAddRole = {
      name: formValue.name,
      description: this.selectedContents.toString(),
    };
    this.service.addUserRole(this.toAddRole).subscribe(res => {
      console.log(res);
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: false,
        data: {
          message: 'The User Role details have been successfully added'
        }
      });

      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    },
      (error: HttpErrorResponse) => {
        console.log(error)
        console.log("ERROR")
        this.snack.open("This user role already exists in the database!", "OK");
      });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm User Role Addition',
        message: 'Are you sure you would add this user role?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.addUserRole(this.addUserRoleForm.value);
        console.log(this.addUserRoleForm.value);
      }
      else {
        console.log('BAD');
      }
    });


  }
}
