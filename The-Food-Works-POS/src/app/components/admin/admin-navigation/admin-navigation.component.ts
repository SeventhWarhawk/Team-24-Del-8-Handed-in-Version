import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {

  admin = false;
  supplierorder = false;
  training = false;
  branch = false;
  supplier = false;
  product = false;
  backup = false;
  customer = false;
  employee = false;
  manufacturing = false;
  customerorder = false; delivery = false;
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  roles: string[] = []; //JSON.parse(localStorage.getItem(userInfo.roles));
  constructor(public userService: UserService) {
    this.roles = this.userInfo.roles;
    console.log(this.roles);
  }

  ngOnInit(): void {
    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == "Admin") {
        this.admin = true;
      }
      if (this.roles[i] == "Backup") {
        this.backup = true;
      }
      if (this.roles[i] == "Branch") {
        this.branch = true;
      }
      if (this.roles[i] == "Customer") {
        this.customer = true;
      }
      if (this.roles[i] == "Customer Order") {
        this.customerorder = true;
      }
      if (this.roles[i] == "Delivery") {
        this.delivery = true;
      }
      if (this.roles[i] == "Employee") {
        this.employee = true;
      }
      if (this.roles[i] == "Manufacturing") {
        this.manufacturing = true;
      }
      if (this.roles[i] == "Product") {
        this.product = true;
      }
      if (this.roles[i] == "Supplier") {
        this.supplier = true;
      }
      if (this.roles[i] == "Supplier Order") {
        this.supplierorder = true;
      }
      if (this.roles[i] == "Training") {
        this.training = true;
      }
    }
  }
}
