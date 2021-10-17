import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {

  constructor(private route: Router) { }

  form: FormGroup = new FormGroup({
    formID: new FormControl(null),
    name: new FormControl("Natasha", Validators.required),
    surname: new FormControl("Venter", Validators.required),
    IDNumber:new FormControl("8702144875963", Validators.required),
    telephone: new FormControl("0824789531", Validators.email),
    email:new FormControl("Natasha@gmail.com", Validators.required),
    branch: new FormControl(1, Validators.required),
    });


  ngOnInit(): void {
  }

  goBack()
  {

      this.route.navigateByUrl('maintain-employee');

  }



}
