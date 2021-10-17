import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UpdateUserRoleComponent } from '../update-user-role/update-user-role.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserRole } from 'src/app/interfaces/admin';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-maintain-user',
  templateUrl: './maintain-user.component.html',
  styleUrls: ['./maintain-user.component.scss']
})
export class MaintainUserComponent implements AfterViewInit {

  viewUserRole: any;
  UserRoles: any;
  displayedColumns: string[] = ['ID', 'name', 'description', 'update', 'delete'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource = new MatTableDataSource<UserRole>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;

  constructor(private adminService: AdminService, public dialog: MatDialog, public snack: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.getAllUserRoles();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllUserRoles() {
    this.loadingMode = 'query';
    this.adminService.getAllUserRoles().subscribe(res => {
      this.UserRoles = res;
      this.dataSource.data = this.UserRoles;
      console.log(this.UserRoles);
      this.loadingMode = 'determinate';
    });
  }

  // For Update
  getRole(UserRoleId: number) {
    console.log(UserRoleId);
    return this.adminService.findUserRole(UserRoleId).subscribe(res => {
      this.viewUserRole = res;
      console.log(res);
      const dialogRef = this.dialog.open(UpdateUserRoleComponent, {
        disableClose: false,
        width: '800px',
        data: {
          ID: this.viewUserRole.id,
          name: this.viewUserRole.name,
          description: this.viewUserRole.description,
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
        this.getAllUserRoles();
      });
      this.getAllUserRoles();

    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      disableClose: false,
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe(r => {
      this.getAllUserRoles();
    });
  }
 deleteType(ProductTypeId: number) {
    console.log(ProductTypeId);
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm User role Deletion',
        message: 'Are you sure you want to delete this role?'
      }
    });
    confirm.afterClosed().subscribe(r => {
      if (r) {
        this.adminService.deleteType(ProductTypeId).subscribe(o => {
          this.getAllUserRoles();
        },
          (error: HttpErrorResponse) => {
            this.snack.open("Delete failed! This user role is already assigned to a user.", "OK");
          });
      }
    });
  }
}
