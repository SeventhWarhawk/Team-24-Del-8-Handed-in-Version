import { MaintainEmployeeComponent } from './../maintain-employee/maintain-employee.component';
import { SuccessModalComponent } from './../../../modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { userEmployee } from './../../../../interfaces/userEmployee';
import { EmployeeServiceService } from './../../../../services/employee.service';
import { Employee } from './../../../../interfaces/employee';
import { MatInputModule } from '@angular/material/input';
import { Component, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
/*import {MaxSizeValidation} from '@angular-material-components'*/

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {

  constructor(private EmployeeService: EmployeeServiceService, @Inject(MAT_DIALOG_DATA) public data: Employee,public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateEmployeeComponent>) { }

form: FormGroup = new FormGroup({
    formID: new FormControl(null),
    name: new FormControl("", [Validators.required,Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z ]*$')]),

    surname: new FormControl("", [Validators.required,Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z ]*$')]),

    IDNumber:new FormControl("", [Validators.required,
    Validators.pattern("^[0-9]*$"), Validators.minLength(13),Validators.maxLength(13)]),


    telephone: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10),
    Validators.maxLength(10)]),

    email:new FormControl("", [Validators.email,Validators.maxLength(50)]),

    branch: new FormControl("", Validators.required),

    userRole: new FormControl("", Validators.required),

    userStatus: new FormControl ("",Validators.required),

    userId: new FormControl ("")
    });

  ngOnInit(): void {
    //console.log (this.data)
    this.getBranches();
    this.getUserRoles();
    this.getUserStatus();

    console.log(this.data.UserId)
    this.form.patchValue({
      name: this.data.employeeName,
      surname: this.data.employeeSurname,
      IDNumber: this.data.EmployeeIdNumber,
      telephone: this.data.employeeTelephone,
      email: this.data.employeeEmail,
      branch: this.data.BranchId,
      userRole: this.data.UserRoleId,
      userStatus: this.data.UserStatusId,
      userId: this.data.UserId,

    });
  }

  branches : any;
  getBranches ()
  {
    this.branches = this.EmployeeService.getBranches().subscribe(res =>{

      this.branches = res;
    })
  }
  userRoles: any;
  getUserRoles ()
  {
    this.EmployeeService.getUserRoles().subscribe(res =>{
      this.userRoles = res;
    })
  }

  userStatus: any;
  getUserStatus ()
  {
    this.EmployeeService.getUserStatus().subscribe(res =>{
      this.userStatus = res;
    })
  }

  toUpdateEmployee: Employee;
  toUpdatedUser: userEmployee;
  updateEmployee (formValue : any)
  {


      this.toUpdateEmployee = {
        employeeName: formValue.name,
        employeeSurname: formValue.surname,
        EmployeeIdNumber: formValue.IDNumber,
        employeeTelephone: formValue.telephone,
        employeeEmail: formValue.email,
        BranchId: formValue.branch}

      this.toUpdatedUser = {
        UserRoleId: formValue.userRole,
        UserStatusId: formValue.userStatus,
        UserId: formValue.userId,
        UserUsername: formValue.email,


      }

      this.EmployeeService.updateEmployee(this.toUpdateEmployee).subscribe(res =>{
        console.log(res);
        this.EmployeeService.updateUser(this.toUpdatedUser).subscribe(res =>{
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              message: 'The Employee’s details have been successfully updated'
            }})

            success.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              this.dialogRef.close();
              window.location.reload();

            }, (error: HttpErrorResponse) => {

              if (error.status === 404) {
                alert('Update of Employee Failed. 404 Error!')

              }
              });


        })
      })


  }

  openModal() {

    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Update Employee',
        message: 'Are you sure you would update this employee?'
      }
    })
    confirm.afterClosed().subscribe(res => {
      if(res)
      {
        console.log('hi');
        this.updateEmployee(this.form.value);
      }
      else
      {
        console.log('BAD');
      }


    });


  }
}
