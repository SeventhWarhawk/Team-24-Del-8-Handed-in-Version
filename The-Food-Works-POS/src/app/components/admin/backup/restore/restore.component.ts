import { OnInit } from '@angular/core';
import { Component, VERSION, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit {

  fileName = '';
  file: File;
  constructor(private http: HttpClient, public adminService: AdminService, public snackBar: MatSnackBar) { }
  ngOnInit(): void {

  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  restore() {
    const formData = new FormData();
    formData.append("file", this.file);

    this.adminService.backup(this.file).subscribe(res => {
      console.log(res);
    }, (error: HttpErrorResponse) => {
      this.snackBar.open('Sorry, there was an error on the server side', 'OK');

    });
  }
}
