import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  date = new Date();
  branch = 'loading...';
  userName = '';
  displayName = '';
  svc: any;
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  constructor(public dialog: MatDialog, private router: Router, public userService: UserService, public branchService: BranchService, private snack: MatSnackBar) {
    this.userName = this.userInfo.displayName;
  }

  ngOnInit(): void {
    this.getBranchName();
  }
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
          localStorage.clear();
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
    else if (route == "/training-modules-home-page/training-modules-home-page") {
      window.open("http://localhost:8080/CompleteTrainingModule.html");
      route = "";
    }
    else if (route == "/report-sales") {
      window.open("http://localhost:8080/SalesReport.html");
      route = "";
    }
    else if (route == "/report-stock") {
      window.open("http://localhost:8080/IngredientsandProductReport.html");
      route = "";
    }
    else if (route == "/report-ingredient") {
      window.open("http://localhost:8080/IngredientsandProductReport.html");
      route = "";
    }
    else if (route == "/report-branch") {
      window.open("http://localhost:8080/BranchReport.html");
      route = "";
    }
    else if (route == "/report-product-trends") {
      window.open("http://localhost:8080/ProductTrendsReport.html");
      route = "";
    }
    else if (route == "/report-home") {
      window.open("http://localhost:8080/Reporting.html");
      route = "";
    }


  }

}

