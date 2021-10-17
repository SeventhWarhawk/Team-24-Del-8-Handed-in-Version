
import { UpdateEmployeeComponent } from './../update-employee/update-employee.component';

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EmployeeServiceService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/interfaces/employee';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';


@Component({
  selector: 'app-maintain-employee',
  templateUrl: './maintain-employee.component.html',
  styleUrls: ['./maintain-employee.component.scss']
})
export class MaintainEmployeeComponent implements AfterViewInit {

  form: FormGroup;
  viewEmployee: any;
  viewEmployeeUpdate: any;
  loadingMode: any;
  Employees: any;
  toSendData: Employee;

  displayedColumns: string[] = ['fullname', 'DOB', 'telephone', 'update','view','delete'];
  dataSource = new MatTableDataSource<Employee>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private EmployeeService: EmployeeServiceService, private formBuilder: FormBuilder,
              public dialog: MatDialog, private _snackBar: MatSnackBar) {}


           


  ngAfterViewInit(): void {
    this.getAllEmployees();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.form = this.formBuilder.group({
      name: [""],
      surname: [""],
      IDNumber: [""],
      telephone: [""],
      email: [""],
      branch: [""],
    })
  }

  goBack() {
    // tslint:disable-next-line:no-unused-expression
    this.viewEmployee == null;
    window.location.reload();
  }
  getAllEmployees() {
    this.loadingMode = 'query';
    this.EmployeeService.getAllEmployees().subscribe(res => {
      this.Employees = res;
      this.dataSource.data = this.Employees;
      this.loadingMode = 'determinate';


    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEmployeeDetails(employeeIDRecieved: any) {

    return this.EmployeeService.getEmployeeDetais(employeeIDRecieved).subscribe(res => {
      this.viewEmployee = res;
      console.log(this.viewEmployee);

      this.form.patchValue({
        name: this.viewEmployee.employeeName,
        surname: this.viewEmployee.employeeSurname,
        IDNumber: this.viewEmployee.employeeIdNumber,
        telephone: this.viewEmployee.employeeTelephone,
        email: this.viewEmployee.employeeEmail,
        branch: this.viewEmployee.branchName,
      });

    });

  }

  deleteEmployee(employeeID: any)
  {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Delete Employee',
        message: 'Are you sure you would delete this employee?'
      }
    });

    confirm.afterClosed().subscribe(res => {
      if (res)
      {
        this.EmployeeService.deleteEmployee(employeeID).subscribe(res =>{
          this.getAllEmployees();
          this._snackBar.open('The Employee was successfully deleted', 'OK');

        },(error: HttpErrorResponse) => {
          console.log(error);
          this._snackBar.open('Sorry, this employee cannot be deleted. Rather change their status to inactive', 'OK');

        });
      }
      else
      {
        console.log('BAD');
      }
    });


  }

  getEmployeeDetailsUpdate(employeeIDRecieved: any)
  {
    return this.EmployeeService.getEmployeeDetais(employeeIDRecieved).subscribe(res => {
      this.viewEmployeeUpdate = res;
      console.log(this.viewEmployeeUpdate.userID);
      const dialogRef = this.dialog.open(UpdateEmployeeComponent, {
        disableClose: true,
        width: 'auto',
        data: {
          employeeName: this.viewEmployeeUpdate.employeeName,
          employeeSurname: this.viewEmployeeUpdate.employeeSurname,
          EmployeeIdNumber: this.viewEmployeeUpdate.employeeIdNumber,
          employeeTelephone: this.viewEmployeeUpdate.employeeTelephone,
          employeeEmail: this.viewEmployeeUpdate.employeeEmail,
          BranchId: this.viewEmployeeUpdate.branchId,
          UserRoleId: this.viewEmployeeUpdate.userRoleId,
          UserStatusId: this.viewEmployeeUpdate.userStatus,
          UserId: this.viewEmployeeUpdate.userID,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  }
}
