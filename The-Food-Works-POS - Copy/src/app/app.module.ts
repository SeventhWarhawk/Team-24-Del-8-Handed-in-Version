import { IngredientReportComponent } from './components/reporting/ingredient-report/ingredient-report.component';


import { ReversePipe } from './components/loyalty/view-loyalty-points/voucher-reverse.pipe';
import { VoucherFilterPipe } from './components/loyalty/view-loyalty-points/voucher-filter.pipe';


import { MaintainBranchStockComponent } from './components/admin/branch/maintain-branch-stock/maintain-branch-stock.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App Components

import { HomeComponent } from './components/home/home/home.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ViewDeliveryComponent } from './components/admin/delivery/view-delivery/view-delivery.component';
import { AddUserComponent } from './components/admin/user/add-user/add-user.component';
import { MaintainUserComponent } from './components/admin/user/maintain-user/maintain-user.component';
import { AddSupplierComponent } from './components/admin/supplier/add-supplier/add-supplier.component';
import { MaintainSupplierComponent } from './components/admin/supplier/maintain-supplier/maintain-supplier.component';
import { MaintainCustomerComponent } from './components/admin/customer/maintain-customer/maintain-customer.component';
import { AddEmployeeComponent } from './components/admin/employee/add-employee/add-employee.component';
import { MaintainEmployeeComponent } from './components/admin/employee/maintain-employee/maintain-employee.component';
import { AddProductComponent } from './components/admin/product/add-product/add-product.component';
import { MaintainProductComponent } from './components/admin/product/maintain-product/maintain-product.component';

import { ReconcileCookingListComponent } from './components/admin/manufacturing/reconcile-cooking-list/reconcile-cooking-list.component';
import { CreateBatchComponent } from './components/admin/manufacturing/create-batch/create-batch.component';
import { MaintainBatchComponent } from './components/admin/manufacturing/maintain-batch/maintain-batch.component';
//import { BackupComponent } from './components/admin/backup/backup/backup.component';
//import { RestoreComponent } from './components/admin/backup/restore/restore.component';
import { CreateTrainingModuleComponent } from './components/admin/training/create-training-module/create-training-module.component';
import { MaintainTrainingModuleComponent } from './components/admin/training/maintain-training-module/maintain-training-module.component';
import { CreateTrainingModuleTypeComponent } from './components/admin/training/create-training-module-type/create-training-module-type.component';
import { MaintainTrainingModuleTypeComponent } from './components/admin/training/maintain-training-module-type/maintain-training-module-type.component';
import { CreateBranchComponent } from './components/admin/branch/create-branch/create-branch.component';
import { ViewBranchComponent } from './components/admin/branch/view-branch/view-branch.component';
import { MaintainBranchComponent } from './components/admin/branch/maintain-branch/maintain-branch.component';
import { RequestBranchStockComponent } from './components/admin/branch/request-branch-stock/request-branch-stock.component';
import { DoBranchStockTakeComponent } from './components/admin/branch/do-branch-stock-take/do-branch-stock-take.component';
import { ReceiveBranchStockComponent } from './components/admin/branch/receive-branch-stock/receive-branch-stock.component';
import { GeneratePendingDeliveriesComponent } from './components/admin/delivery/generate-pending-deliveries/generate-pending-deliveries.component';
import { PointOfSalesHomeComponent } from './components/point-of-sales/point-of-sales-home/point-of-sales-home.component';
import { LoginComponent } from './components/access/login/login.component';
// tslint:disable-next-line:max-line-length
import { AdminNavigationComponent } from './components/admin/admin-navigation/admin-navigation.component';
import { ReportingHomeComponent } from './components/reporting/reporting-home/reporting-home.component';
import { StockReportComponent } from './components/reporting/stock-report/stock-report.component';
import { UpdateUserRoleComponent } from './components/admin/user/update-user-role/update-user-role.component';
import { UpdateSupplierComponent } from './components/admin/supplier/update-supplier/update-supplier.component';
import { UpdateCustomerComponent } from './components/admin/customer/update-customer/update-customer.component';
import { UpdateEmployeeComponent } from './components/admin/employee/update-employee/update-employee.component';
import { ViewEmployeeComponent } from './components/admin/employee/view-employee/view-employee.component';
import { UpdateBatchComponent } from './components/admin/manufacturing/update-batch/update-batch.component';
import { UpdateProductComponent } from './components/admin/product/update-product/update-product.component';
import { UpdateTrainingModuleTypeComponent } from './components/admin/training/update-training-module-type/update-training-module-type.component';
import { UpdateTrainingModuleComponent } from './components/admin/training/update-training-module/update-training-module.component';
import { TrainingModulesHomeComponent } from './components/training-modules/training-modules-home/training-modules-home.component';
import { CashUpComponent } from './components/point-of-sales/cash-up/cash-up.component';
import { SearchSaleComponent } from './components/point-of-sales/search-sale/search-sale.component';
import { AddProductRequestModalComponent } from './components/modals/add-product-request-modal/add-product-request-modal.component';
import { MatChipsModule } from '@angular/material/chips';
// Breadcrumbs
// import { BreadcrumbModule } from 'xng-breadcrumb';
// import { BreadcrumbService } from 'xng-breadcrumb';
// Angular Material Components

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatBadgeModule } from '@angular/material/badge';


import { FlexLayoutModule } from '@angular/flex-layout';
//Firebase imports
//import { environment } from "../environments/environment"
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
//import { AngularFireAuthModule } from '@angular/fire/auth';
//

//Google Maps
// import { Options } from 'ngx-google-places-autocomplete/objects/options/options';

const config = {
  apiKey: "AIzaSyAlvytxkHXsGNdRdOYIV6z6qXK2_O71Tww",
  authDomain: "the-food-works-bbf87.firebaseapp.com",
  databaseURL: "https://the-food-works-bbf87-default-rtdb.firebaseio.com",
  projectId: "the-food-works-bbf87",
  storageBucket: "the-food-works-bbf87.appspot.com",
  messagingSenderId: "337365765522",
  appId: "1:337365765522:web:dc6404cd25c5fecec2054b",
  measurementId: "G-9M3Z2H0PRT"
}


// Angular Components
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingModulesContentComponent } from './components/training-modules/training-modules-content/training-modules-content.component';
import { ConfirmModalComponent } from './components/modals/confirm-modal/confirm-modal.component';
import { CookieService } from 'ngx-cookie-service';

// Google API Components
//import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

// Third Party NPM Components
import { ConfirmSnackbarComponent } from './components/modals/confirm-snackbar/confirm-snackbar.component';
import { AddProductModalComponent } from './components/modals/add-product-modal/add-product-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TrainingModulesContentViewComponent } from './components/training-modules/training-modules-content-view/training-modules-content-view.component';
import { AddLoyaltyMemberComponent } from './components/loyalty/add-loyalty-member/add-loyalty-member.component';
import { ViewLoyaltyPointsComponent } from './components/loyalty/view-loyalty-points/view-loyalty-points.component';
import { RedeemVoucherComponent } from './components/loyalty/redeem-voucher/redeem-voucher.component';
import { WriteOffComponent } from './components/admin/user/write-off/write-off.component';
import { WriteOffDetailsComponent } from './components/admin/user/write-off-details/write-off-details.component';
import { ForgotOTPComponent } from './components/access/forgot-otp/forgot-otp.component';
import { ForgotPasswordComponent } from './components/access/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/access/reset-password/reset-password.component';
// tslint:disable-next-line:max-line-length
import { MaintainSupplierOrderComponent } from './components/admin/supplier-order/maintain-supplier-order/maintain-supplier-order.component';
import { PlaceSupplierOrderComponent } from './components/admin/supplier-order/place-supplier-order/place-supplier-order.component';
import { ReceiveSupplierOrderComponent } from './components/admin/supplier-order/receive-supplier-order/receive-supplier-order.component';
import { GenerateConfirmationComponent } from './components/admin/delivery/generate-confirmation/generate-confirmation.component';
import { ViewDeliveryModalComponent } from './components/admin/delivery/view-delivery-modal/view-delivery-modal.component';
import { ChartsModule } from 'ng2-charts';
import { RequestEmailComponent } from './components/modals/request-email/request-email.component';
import { AuditComponent } from './components/admin/audit/audit.component';
import { BranchReportComponent } from './components/reporting/branch-report/branch-report.component';
import { GenerateSalesReportComponent } from './components/reporting/generate-sales-report/generate-sales-report.component';
import { ProductTrendsReportComponent } from './components/reporting/product-trends-report/product-trends-report.component';

import { NgxPrintModule } from 'ngx-print';
import { SuccessModalComponent } from './components/modals/success-modal/success-modal.component'
import { MaterialFileInputModule } from 'ngx-material-file-input';

// Firebase Import
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment"
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireDatabaseModule } from "@angular/fire/database";

// Directives Import
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { RegisterComponentComponent } from './components/access/register-component/register-component.component';
import { RouterModule, Routes } from '@angular/router';
import { CheckBranchComponent } from './components/modals/check-branch/check-branch.component';
import { AddProductQuantityComponent } from './components/modals/add-product-quantity/add-product-quantity.component';
//import { AddPrductQuantityComponent } from './src/app/components/modals/add-prduct-quantity/add-prduct-quantity.component';
import { UploadTaskComponent } from './components/admin/training/upload-task/upload-task.component';
// import { BranchReportComponent } from './components/reporting/branch-report/branch-report.component';

import { AddCookingListComponent } from './components/modals/add-cooking-list/add-cooking-list.component';
import { SelectCookingListComponent } from './components/modals/select-cooking-list/select-cooking-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//Date Module
// import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// const platformRoutes: Routes = [
//   {
//     path: '',
//     component: AdminHomeComponent,
//     children: [
//       { path: '', redirectTo: 'parent', pathMatch: 'full' },
//       {
//         path: 'parent',
//         component: WriteOffComponent,
//         data: { breadcrumb: { alias: 'Home' } },
//         children: [
//           {
//             path: 'WriteOffDetails',
//             component: WriteOffDetailsComponent,
//             data: {
//               breadcrumb: { alias: 'WriteOffDetails' }
//             },
//           }
//         ],
//       },
//     ],
//   },
// ];
import { CompleteOrderComponent } from './components/point-of-sales/complete-order/complete-order.component';
import { PaymentDialogComponent } from './components/point-of-sales/payment-dialog/payment-dialog.component';
import { AddSupplierTypeComponent } from './components/admin/supplier-type/add-supplier-type/add-supplier-type.component';
import { MaintainSupplierTypeComponent } from './components/admin/supplier-type/maintain-supplier-type/maintain-supplier-type.component';
import { UpdateSupplierTypeComponent } from './components/admin/supplier-type/update-supplier-type/update-supplier-type.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ViewCookingListComponent } from './components/admin/manufacturing/view-cooking-list/view-cooking-list.component';
import { AdjustBusinessRulesComponent } from './components/admin/adjust-business-rules/adjust-business-rules.component';
import { PackOrderDialogComponent } from './components/admin/customer-order/pack-order-dialog/pack-order-dialog.component';
import { PackCustomerOrderComponent } from './components/admin/customer-order/pack-customer-order/pack-customer-order.component';
import { AssignProductComponent } from './components/admin/branch/assign-product/assign-product.component';
import { UpdateBranchStockComponent } from './components/admin/branch/update-branch-stock/update-branch-stock.component';
import { MaintainLoyaltyComponent } from './components/admin/loyalty/maintain-loyalty/maintain-loyalty.component';
import { CurrencyPipe } from '@angular/common';
import { LoyaltySettingsDialogComponent } from './components/admin/loyalty/loyalty-settings-dialog/loyalty-settings-dialog.component';
import { VoucherQrDialogComponent } from './components/loyalty/view-loyalty-points/voucher-qr-dialog/voucher-qr-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { VoucherRedemptionsDialogComponent } from './components/loyalty/view-loyalty-points/voucher-redemptions-dialog/voucher-redemptions-dialog.component';
import { AddLoyaltyCustomerComponent } from './components/loyalty/add-loyalty-customer/add-loyalty-customer.component';
import { ResetForgottenPasswordComponent } from './components/access/reset-forgotten-password/reset-forgotten-password.component';
import { AttachCustomerDialogComponent } from './components/point-of-sales/attach-customer-dialog/attach-customer-dialog.component';
import { BackupComponent } from './components/admin/backup/backup/backup.component';
import { RestoreComponent } from './components/admin/backup/restore/restore.component';
import { LoyaltyVideoDialogComponent } from './components/admin/loyalty/loyalty-video-dialog/loyalty-video-dialog.component';

@NgModule({
  // ----BREADCRUMBS START
  // imports: [AdminHomeComponent.forChild(WriteOffComponent)],
  // BREADCRUMBS END
  exports: [RouterModule],
  declarations: [
    AppComponent,
    HomeComponent,
    AdminHomeComponent,
    ViewDeliveryComponent,
    AddUserComponent,
    MaintainUserComponent,
    AddSupplierComponent,
    MaintainSupplierComponent,
    MaintainCustomerComponent,
    AddEmployeeComponent,
    MaintainEmployeeComponent,
    AddProductComponent,
    MaintainProductComponent,
    ReconcileCookingListComponent,
    CreateBatchComponent,
    MaintainBatchComponent,
    //BackupComponent,
    //RestoreComponent,
    CreateTrainingModuleComponent,
    MaintainTrainingModuleComponent,
    CreateTrainingModuleTypeComponent,
    MaintainTrainingModuleTypeComponent,
    CreateBranchComponent,
    ViewBranchComponent,
    MaintainBranchComponent,
    RequestBranchStockComponent,
    DoBranchStockTakeComponent,
    ReceiveBranchStockComponent,
    GeneratePendingDeliveriesComponent,
    PointOfSalesHomeComponent,
    LoginComponent,
    AdminNavigationComponent,
    ReportingHomeComponent,
    StockReportComponent,
    GenerateSalesReportComponent,
    TrainingModulesHomeComponent,
    UpdateUserRoleComponent,
    UpdateSupplierComponent,
    UpdateCustomerComponent,
    UpdateEmployeeComponent,
    TrainingModulesHomeComponent,
    UpdateTrainingModuleComponent,
    UpdateTrainingModuleTypeComponent,
    UpdateProductComponent,
    UpdateBatchComponent,
    ViewEmployeeComponent,
    TrainingModulesContentComponent,
    ConfirmModalComponent,
    ConfirmSnackbarComponent,
    AddProductModalComponent,
    MaintainBranchStockComponent,
    TrainingModulesContentViewComponent,
    AddLoyaltyMemberComponent,
    ViewLoyaltyPointsComponent,
    RedeemVoucherComponent,
    CashUpComponent,
    SearchSaleComponent,
    WriteOffComponent,
    WriteOffDetailsComponent,
    ForgotOTPComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MaintainSupplierOrderComponent,
    PlaceSupplierOrderComponent,
    ReceiveSupplierOrderComponent,
    GenerateConfirmationComponent,
    ViewDeliveryModalComponent,
    NumbersOnlyDirective,
    RegisterComponentComponent,
    SuccessModalComponent,
    CheckBranchComponent,
    BranchReportComponent,
    ProductTrendsReportComponent,
    AuditComponent,
    RequestEmailComponent,
    SuccessModalComponent,
    RegisterComponentComponent,
    SuccessModalComponent,
    CheckBranchComponent,
    AddProductQuantityComponent,
    //AddPrductQuantityComponent,
    AddProductRequestModalComponent,
    UploadTaskComponent,
    // BranchReportComponent,
    IngredientReportComponent,
    AddCookingListComponent,
    SelectCookingListComponent,
    CompleteOrderComponent,
    PaymentDialogComponent,
    AddSupplierTypeComponent,
    MaintainSupplierTypeComponent,
    UpdateSupplierTypeComponent,
    SplashScreenComponent,
    AdminDashboardComponent,
    NotificationComponent,
    ViewCookingListComponent,
    AdjustBusinessRulesComponent,
    PackOrderDialogComponent,
    PackCustomerOrderComponent,
    AssignProductComponent,
    UpdateBranchStockComponent,
    MaintainLoyaltyComponent,
    LoyaltySettingsDialogComponent,
    VoucherFilterPipe,
    ReversePipe,
    VoucherQrDialogComponent,
    VoucherRedemptionsDialogComponent,
    AddLoyaltyCustomerComponent,
    ResetForgottenPasswordComponent,
    AttachCustomerDialogComponent,
    RestoreComponent,
    BackupComponent,
    LoyaltyVideoDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    // BreadcrumbModule,
    MatChipsModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatSidenavModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    MatCardModule,
    HttpClientModule,
    MatGridListModule,
    MatDialogModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTabsModule,
    DragDropModule,
    //MatGoogleMapsAutocompleteModule,
    MatProgressSpinnerModule,
    EditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartsModule,
    MaterialFileInputModule,
    GooglePlaceModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBkviWcX9UcLy-40Inq1Vua6jr5KZqyt2Q',
      libraries: ['places'],
    }),
    MatToolbarModule,
    MatIconModule,
    // MatMomentDateModule,
    NgxPrintModule,
    FlexLayoutModule,
    GooglePlaceModule,
    //Options
    // AngularFireModule.initializeApp(config),
    // //AngularFireAuthModule,
    // AngularFirestoreModule, // firestore
    // AngularFireStorageModule // storage
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatBadgeModule,
    QRCodeModule,
    Ng2SearchPipeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: CookieService },
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
