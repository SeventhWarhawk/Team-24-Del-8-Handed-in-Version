import { Router, RouterOutlet } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from 'src/app/services/report/report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import anime from 'animejs'
import { MatAccordion } from '@angular/material/expansion';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { BranchService } from 'src/app/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit {
  admin = false;
  supplierorder = false;
  training = false;
  Branch = false;
  loyalty = false;
  supplier = false;
  product = false;
  backup = false;
  customer = false;
  employee = false;
  manufacturing = false;
  customerorder = false; delivery = false;
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  roles: string[] = []; //JSON.parse(localStorage.getItem(userInfo.roles));

  constructor(public dialog: MatDialog, private service: ReportService, public userService: UserService, private formBuilder: FormBuilder, private router: Router, public branchService: BranchService, private snack: MatSnackBar) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.userName = this.userInfo.displayName;
    this.roles = this.userInfo.roles;
    console.log(this.roles);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  branchName = localStorage['branch'];

  // Panel States
  mep0State: any;
  mep1State: any;
  mep2State: any;
  mep3State: any;
  mep4State: any;
  mep5State: any;
  mep6State: any;
  mep7State: any;
  mep8State: any;
  mep9State: any;
  mep10State: any;
  mep11State: any;
  mep12State: any;
  stateArray = [false, false, false, false, false, false, false, false, false, false, false, false]

  ngOnInit() {
    this.getBranchName();
    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == "Admin") {
        this.admin = true;
      }
      if (this.roles[i] == "Loyalty") {
        this.loyalty = true;
      }
      if (this.roles[i] == "Backup") {
        this.backup = true;
      }
      if (this.roles[i] == "Branch") {
        this.Branch = true;
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

  // ToolBar
  date = new Date();
  branch = 'loading...';
  userName = '';
  displayName = '';
  svc: any;

  getUserName() {
    if (this.userName == null || undefined) {
      this.router.navigateByUrl('login');
      return 'dummy';
    }
    else if (this.userName != null) {
      return this.userName!;
    }
    else
      return this.svc.userInfo.displayName;
  }
  getBranchName() {
    const branchId = JSON.parse(localStorage.getItem('branch')!);
    return this.branchService.getBranchName(branchId)
      .subscribe((res: any) => {
        this.branch = res.branchName;

      });
  }

  redirect() {
    console.log('busy');
    this.router.navigateByUrl('reset-password');
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Leaving already?',
        message: 'Are you sure you want to log out?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.userService.Logout().subscribe(r => {
          console.log(r);
          this.router.navigateByUrl('/login');
        }, (error: HttpErrorResponse) => {
          this.snack.open('Tasks pending completion - you may not log out.', 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: 3000
          });
        });
      }
    });
  }

  togglePanel(pos: any) {
    this.stateArray[pos] = !this.stateArray[pos];

    // Thats alot of ifs ᕙ(⇀‸↼‶)ᕗ
    if (pos == 0) {
      this.mep0State = this.stateArray[0];
    } else {
      this.mep0State = false;
    }
    if (pos == 1) {
      this.mep1State = this.stateArray[1];
    } else {
      this.mep1State = false;
    }
    if (pos == 2) {
      this.mep2State = this.stateArray[2];
    } else {
      this.mep2State = false;
    }
    if (pos == 3) {
      this.mep3State = this.stateArray[3];
    } else {
      this.mep3State = false;
    }
    if (pos == 4) {
      this.mep4State = this.stateArray[4];
    } else {
      this.mep4State = false;
    }
    if (pos == 5) {
      this.mep5State = this.stateArray[5];
    } else {
      this.mep5State = false;
    }
    if (pos == 6) {
      this.mep6State = this.stateArray[6];
    } else {
      this.mep6State = false;
    }
    if (pos == 7) {
      this.mep7State = this.stateArray[7];
    } else {
      this.mep7State = false;
    }
    if (pos == 8) {
      this.mep8State = this.stateArray[8];
    } else {
      this.mep8State = false;
    }
    if (pos == 9) {
      this.mep9State = this.stateArray[9];
    } else {
      this.mep9State = false;
    }
    if (pos == 10) {
      this.mep10State = this.stateArray[10];
    } else {
      this.mep10State = false;
    }
    if (pos == 11) {
      this.mep11State = this.stateArray[11];
    } else {
      this.mep11State = false;
    }
    if (pos == 12) {
      this.mep12State = this.stateArray[12];
    } else {
      this.mep12State = false;
    }

    let div = document.getElementsByClassName('expand-select') as HTMLCollectionOf<HTMLElement>;

    if (div.length != 0) {
      for (let i = 0; i < div.length; i++) {
        if (div[i].style.height = "100%") {
          div[i].style.height = "0%";
          div[i].style.transition = "0.04s";
        }

      }
    }
    anime({
      targets: '.expand-select',
      height: '100%',
      easing: 'easeOutBounce',
      duration: 3000,
      direction: 'alternate',
      loop: false
    });
  }

  // HELP ROUTING
  goToHelp() {
    var route = this.router.url;
    if (route == "/point-of-sales-home") {
      window.open("http://localhost:8080/PointOfSale.html");
      route = "";
    }
    if (route == "/admin-home/maintain-user-role") {
      window.open("http://localhost:8080/MaintainUserRole.html");
      route = "";
    }
    else if (route == "/admin-home/write-off") {
      window.open("http://localhost:8080/WriteOffStock.html");
      route = "";
    }
    else if (route == "/admin-home/audit-trail") {
      window.open("http://localhost:8080/ViewAuditTrail.html");
      route = "";
    }
    else if (route == "/admin-home/adjust-business-rules") {
      window.open("http://localhost:8080/AdjustBusinessRules.html");
      route = "";
    }
    else if (route == "/home" || route == "/admin-home/admin-dashboard") {
      console.log('I am working')
      window.open("http://localhost:8080/Genpoint%20System%20Help.html");
      route = "";
    }
    else if (route == "/admin-home/add-employee") {
      window.open("http://localhost:8080/AddEmployee.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-employee") {
      window.open("http://localhost:8080/MaintainEmployee.html");
      route = "";
    }
    else if (route == "/admin-home/view-employee") {
      window.open("http://localhost:8080/ViewEmployee.html");
      route = "";
    }
    else if (route == "/admin-home/pack-customer-order") {
      window.open("http://localhost:8080/PackCustomerOrder.html");
      route = "";
    }
    else if (route == "/admin-home/add-supplier") {
      window.open("http://localhost:8080/AddSupplier.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-supplier") {
      window.open("http://localhost:8080/MaintainSupplier.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-supplier-type") {
      window.open("http://localhost:8080/MaintainSupplierType.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-supplier-order") {
      window.open("http://localhost:8080/MaintainSupplierOrder.html");
      route = "";
    }
    else if (route == "/admin-home/add-product") {
      window.open("http://localhost:8080/AddProduct.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-product") {
      window.open("http://localhost:8080/MaintainProduct.html");
      route = "";
    }
    else if (route == "/admin-home/view-delivery") {
      window.open("http://localhost:8080/ViewDelivery.html");
      route = "";
    }
    else if (route == "/admin-home/generate-pending-deliveries") {
      window.open("http://localhost:8080/GeneratePendingDeliveries.html");
      route = "";
    }
    else if (route == "/admin-home/create-batch") {
      window.open("http://localhost:8080/CreateBatch.html");
      route = "";
    }
    else if (route == "/admin-home/reconcile-cooking-list") {
      window.open("http://localhost:8080/ReconcileCookingList.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-batch") {
      window.open("http://localhost:8080/MaintainBatch.html");
      route = "";
    }
    else if (route == "/admin-home/view-cooking-list") {
      window.open("http://localhost:8080/ViewCookingList.html");
      route = "";
    }
    else if (route == "/admin-home/backup") {
      window.open("http://localhost:8080/CreateDatabaseBackup.html");
      route = "";
    }
    else if (route == "/admin-home/restore") {
      window.open("http://localhost:8080/RestoreDatabase.html");
      route = "";
    }
    else if (route == "/admin-home/create-training-module") {
      window.open("http://localhost:8080/CreateTrainingModule.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-training-module") {
      window.open("http://localhost:8080/MaintainTrainingModule.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-training-module-type") {
      window.open("http://localhost:8080/MaintainTrainingModuleType.html");
      route = "";
    }
    else if (route == "/admin-home/create-branch") {
      window.open("http://localhost:8080/CreateBranch.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-branch") {
      window.open("http://localhost:8080/MaintainBranch.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-branch-stock") {
      window.open("http://localhost:8080/MaintainBranchStock.html");
      route = "";
    }
    else if (route == "/admin-home/request-branch-stock") {
      window.open("http://localhost:8080/RequestBranchStock.html");
      route = "";
    }
    else if (route == "/admin-home/do-branch-stock-take") {
      window.open("http://localhost:8080/DoBranchStockTake.html");
      route = "";
    }
    else if (route == "/admin-home/receive-branch-stock") {
      window.open("http://localhost:8080/ReceiveBranchStock.html");
      route = "";
    }
    else if (route == "/admin-home/maintain-loyalty") {
      window.open("http://localhost:8080/MaintainLoyalty.html");
      route = "";
    }
  }
}
