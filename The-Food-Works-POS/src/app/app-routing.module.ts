import { AdjustBusinessRulesComponent } from './components/admin/adjust-business-rules/adjust-business-rules.component';
import { ViewCookingListComponent } from './components/admin/manufacturing/view-cooking-list/view-cooking-list.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/access/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/access/forgot-password/forgot-password.component';
import { CashUpComponent } from './components/point-of-sales/cash-up/cash-up.component';
import { SearchSaleComponent } from './components/point-of-sales/search-sale/search-sale.component';
import { ReceiveSupplierOrderComponent } from './components/admin/supplier-order/receive-supplier-order/receive-supplier-order.component';
import { MaintainSupplierOrderComponent } from './components/admin/supplier-order/maintain-supplier-order/maintain-supplier-order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { PointOfSalesHomeComponent } from './components/point-of-sales/point-of-sales-home/point-of-sales-home.component';
import { CompleteOrderComponent } from './components/point-of-sales/complete-order/complete-order.component';
import { ReportingHomeComponent } from './components/reporting/reporting-home/reporting-home.component';
import { ProductTrendsReportComponent } from './components/reporting/product-trends-report/product-trends-report.component';
import { GenerateSalesReportComponent } from './components/reporting/generate-sales-report/generate-sales-report.component';
import { TrainingModulesHomeComponent } from './components/training-modules/training-modules-home/training-modules-home.component';
import { TrainingModulesContentComponent } from './components/training-modules/training-modules-content/training-modules-content.component';
import { TrainingModulesContentViewComponent } from './components/training-modules/training-modules-content-view/training-modules-content-view.component';
import { LoginComponent } from './components/access/login/login.component';
import { ViewDeliveryComponent } from './components/admin/delivery/view-delivery/view-delivery.component';
import { GeneratePendingDeliveriesComponent } from './components/admin/delivery/generate-pending-deliveries/generate-pending-deliveries.component';
import { MaintainUserComponent } from './components/admin/user/maintain-user/maintain-user.component';
import { AddUserComponent } from './components/admin/user/add-user/add-user.component';
import { UpdateUserRoleComponent } from './components/admin/user/update-user-role/update-user-role.component';

// Imported Customer Order Components
import { PackCustomerOrderComponent } from './components/admin/customer-order/pack-customer-order/pack-customer-order.component';

// Imported Training Components (Admin Subsystem for Training)
import { MaintainTrainingModuleComponent } from './components/admin/training/maintain-training-module/maintain-training-module.component';
import { MaintainTrainingModuleTypeComponent } from './components/admin/training/maintain-training-module-type/maintain-training-module-type.component';
import { CreateTrainingModuleTypeComponent } from './components/admin/training/create-training-module-type/create-training-module-type.component';
import { CreateTrainingModuleComponent } from './components/admin/training/create-training-module/create-training-module.component';
import { UpdateTrainingModuleComponent } from './components/admin/training/update-training-module/update-training-module.component';
import { MaintainSupplierComponent } from './components/admin/supplier/maintain-supplier/maintain-supplier.component';
import { AddSupplierComponent } from './components/admin/supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './components/admin/supplier/update-supplier/update-supplier.component';
import { MaintainEmployeeComponent } from './components/admin/employee/maintain-employee/maintain-employee.component';
import { AddEmployeeComponent } from './components/admin/employee/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/admin/employee/view-employee/view-employee.component';
import { UpdateEmployeeComponent } from './components/admin/employee/update-employee/update-employee.component';
import { MaintainProductComponent } from './components/admin/product/maintain-product/maintain-product.component';
import { AddProductComponent } from './components/admin/product/add-product/add-product.component';
import { UpdateProductComponent } from './components/admin/product/update-product/update-product.component';
import { MaintainCustomerComponent } from './components/admin/customer/maintain-customer/maintain-customer.component';
import { UpdateCustomerComponent } from './components/admin/customer/update-customer/update-customer.component';
import { MaintainBatchComponent } from './components/admin/manufacturing/maintain-batch/maintain-batch.component';
import { CreateBatchComponent } from './components/admin/manufacturing/create-batch/create-batch.component';
import { ReconcileCookingListComponent } from './components/admin/manufacturing/reconcile-cooking-list/reconcile-cooking-list.component';
import { UpdateBatchComponent } from './components/admin/manufacturing/update-batch/update-batch.component';
import { MaintainBranchComponent } from './components/admin/branch/maintain-branch/maintain-branch.component';
import { CreateBranchComponent } from './components/admin/branch/create-branch/create-branch.component';
import { ReceiveBranchStockComponent } from './components/admin/branch/receive-branch-stock/receive-branch-stock.component';
import { DoBranchStockTakeComponent } from './components/admin/branch/do-branch-stock-take/do-branch-stock-take.component';
import { RequestBranchStockComponent } from './components/admin/branch/request-branch-stock/request-branch-stock.component';
import { ViewBranchComponent } from './components/admin/branch/view-branch/view-branch.component';
//import { RestoreComponent } from './components/admin/backup/restore/restore.component';
//import { BackupComponent } from './components/admin/backup/backup/backup.component';
import { UpdateTrainingModuleTypeComponent } from './components/admin/training/update-training-module-type/update-training-module-type.component';
import { MaintainBranchStockComponent } from './components/admin/branch/maintain-branch-stock/maintain-branch-stock.component';
import { WriteOffComponent } from './components/admin/user/write-off/write-off.component';
import { ForgotOTPComponent } from './components/access/forgot-otp/forgot-otp.component';
import { WriteOffDetailsComponent } from './components/admin/user/write-off-details/write-off-details.component';
import { BranchReportComponent } from './components/reporting/branch-report/branch-report.component';
import { AuditComponent } from './components/admin/audit/audit.component';
import { MaintainSupplierTypeComponent } from './components/admin/supplier-type/maintain-supplier-type/maintain-supplier-type.component';
import { StockReportComponent } from './components/reporting/stock-report/stock-report.component';
import { MaintainLoyaltyComponent } from './components/admin/loyalty/maintain-loyalty/maintain-loyalty.component';
import { ResetForgottenPasswordComponent } from './components/access/reset-forgotten-password/reset-forgotten-password.component';
import { TrainingModulesHomePageComponent } from './components/training-modules/training-modules-home-page/training-modules-home-page.component';
import { IngredientReportComponent } from './components/reporting/ingredient-report/ingredient-report.component';
import { BackupComponent } from './components/admin/backup/backup/backup.component';
import { RestoreComponent } from './components/admin/backup/restore/restore.component';


const routes: Routes = [

  // Routed Login Components
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgotOTP', component: ForgotOTPComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-forgotten-password', component: ResetForgottenPasswordComponent },

  // Routed Home Components
  { path: 'home', component: HomeComponent },

  // Routed POS Components
  { path: 'point-of-sales-home', component: PointOfSalesHomeComponent },
  { path: 'search-sale', component: SearchSaleComponent },
  { path: 'cash-up', component: CashUpComponent },
  { path: 'complete-order', component: CompleteOrderComponent },

  // Routed Reporting Components
  // includes role restriction (AuthGuard)
  { path: 'report-home', component: ReportingHomeComponent, canActivate: [AuthGuard] },
  { path: 'report-sales', component: GenerateSalesReportComponent, canActivate: [AuthGuard] },
  { path: 'report-stock', component: StockReportComponent, canActivate: [AuthGuard] },
  { path: 'report-product-trends', component: ProductTrendsReportComponent },
  { path: 'report-branch', component: BranchReportComponent },
  { path: 'report-ingredient', component: IngredientReportComponent, canActivate: [AuthGuard] },

  // Routed Admin Module (In Order of Appearance)
  {
    path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthGuard],
    children: [
      // Default Route (admin home page, i.e. dashboard)
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
      { path: 'admin-dashboard', component: AdminDashboardComponent },

      // Admin Navigation
      { path: 'maintain-user-role', component: MaintainUserComponent },
      { path: 'maintain-user-role/update-user-role', component: UpdateUserRoleComponent },
      { path: 'add-user-role', component: AddUserComponent },
      { path: 'write-off', component: WriteOffComponent },
      { path: 'write-off-details', component: WriteOffDetailsComponent },
      { path: 'audit-trail', component: AuditComponent },
      { path: 'adjust-business-rules', component: AdjustBusinessRulesComponent },

      // Supplier Order Navigation
      { path: 'maintain-supplier-order', component: MaintainSupplierOrderComponent },
      { path: 'receive-supplier-order', component: ReceiveSupplierOrderComponent }, //Here

      // Customer Navigation
      { path: 'maintain-customer', component: MaintainCustomerComponent },
      { path: 'maintain-customer/update-customer', component: UpdateCustomerComponent }, //Here

      // Employee Navigation
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'maintain-employee', component: MaintainEmployeeComponent },
      { path: 'maintain-employee/update-employee', component: UpdateEmployeeComponent }, //Here
      { path: 'maintain-employee/view-employee', component: ViewEmployeeComponent }, //Here

      // Customer Order Navigation
      { path: 'pack-customer-order', component: PackCustomerOrderComponent },

      // Supplier Navigation
      { path: 'add-supplier', component: AddSupplierComponent },
      { path: 'maintain-supplier', component: MaintainSupplierComponent },
      { path: 'maintain-supplier/update-supplier/: id', component: UpdateSupplierComponent }, //Here
      { path: 'maintain-supplier-type', component: MaintainSupplierTypeComponent },

      // Product Navigation
      { path: 'add-product', component: AddProductComponent },
      { path: 'maintain-product', component: MaintainProductComponent },
      { path: 'maintain-product/update-product', component: UpdateProductComponent }, //Here

      // Delivery Navigation
      { path: 'view-delivery', component: ViewDeliveryComponent },
      { path: 'generate-pending-deliveries', component: GeneratePendingDeliveriesComponent },

      // Manufacturing Navigation
      { path: 'create-batch', component: CreateBatchComponent },
      { path: 'reconcile-cooking-list', component: ReconcileCookingListComponent },
      { path: 'maintain-batch', component: MaintainBatchComponent },
      { path: 'maintain-batch/update-batch', component: UpdateBatchComponent }, //Here
      { path: 'view-cooking-list', component: ViewCookingListComponent },

      // Backup Navigation
      { path: 'backup', component: BackupComponent },
      { path: 'restore', component: RestoreComponent },
      // { path: 'audit', component: AuditComponent }, Not Used (Remove if possible)

      // Training Navigation
      { path: 'create-training-module', component: CreateTrainingModuleComponent },
      { path: 'maintain-training-module', component: MaintainTrainingModuleComponent },
      { path: 'maintain-training-module/update-training-module/:id', component: UpdateTrainingModuleComponent }, //Here
      { path: 'create-training-module-type', component: CreateTrainingModuleTypeComponent },
      { path: 'maintain-training-module-type', component: MaintainTrainingModuleTypeComponent },
      { path: 'maintain-training-module-type/update-training-module-type', component: UpdateTrainingModuleTypeComponent }, //Here

      // Branch Navigation
      { path: 'create-branch', component: CreateBranchComponent },
      { path: 'maintain-branch', component: MaintainBranchComponent },
      { path: 'maintain-branch/view-branch/:id', component: ViewBranchComponent }, //Here
      { path: 'maintain-branch-stock', component: MaintainBranchStockComponent },
      { path: 'request-branch-stock', component: RequestBranchStockComponent },
      { path: 'do-branch-stock-take', component: DoBranchStockTakeComponent },
      { path: 'receive-branch-stock', component: ReceiveBranchStockComponent },

      // Loyalty Navigation
      { path: 'maintain-loyalty', component: MaintainLoyaltyComponent },

    ]
  },

  // Routed Training Module (Side Navigation Component)
  { path: 'training-module-home', component: TrainingModulesHomeComponent },
  {
    path: 'training-modules-home-page', component: TrainingModulesHomeComponent, children: [
      { path: '', redirectTo: 'training-modules-home-page', pathMatch: 'full' },
      { path: 'training-modules-home-page', component: TrainingModulesHomePageComponent },
      { path: 'training-modules-content/:id', component: TrainingModulesContentComponent },
      { path: 'training-modules-content-view/:id', component: TrainingModulesContentViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
