import { OnInit } from '@angular/core';
import { Component, VERSION, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {

  fileName = '';
  file: File;
  invalid = true;
  constructor(private http: HttpClient, public adminService: AdminService, public snackBar: MatSnackBar) { }
  ngOnInit(): void {

  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.invalid = false;

  }
  //   if (file) {

  //     this.fileName = file.name;

  //     const formData = new FormData();

  //     formData.append("file", file);
  //     this.adminService.backup(formData).subscribe(res => {
  //       console.log(res);
  //     }, (error: HttpErrorResponse) => {
  //       this.snackBar.open('Sorry, there was an error on the server side', 'OK');

  //     });
  //   }
  // }

  backup() {
    const formData = new FormData();
    formData.append("file", this.file);

    this.adminService.backup(this.file).subscribe(res => {
      console.log(res);
    }, (error: HttpErrorResponse) => {
      this.snackBar.open('Sorry, there was an error on the server side', 'OK');

    });
  }

}
