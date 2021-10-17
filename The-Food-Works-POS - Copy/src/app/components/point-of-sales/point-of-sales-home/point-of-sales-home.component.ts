import { RedeemVoucherComponent } from './../../loyalty/redeem-voucher/redeem-voucher.component';
import { ViewLoyaltyPointsComponent } from './../../loyalty/view-loyalty-points/view-loyalty-points.component';
import { AddLoyaltyMemberComponent } from './../../loyalty/add-loyalty-member/add-loyalty-member.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SaleService } from 'src/app/services/sale.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product, SaleData, SaleOverview } from 'src/app/interfaces/sale';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IPaymentDialog } from 'src/app/interfaces/payment';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { RequestEmailComponent } from '../../modals/request-email/request-email.component';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { LoyaltyService } from 'src/app/services/loyalty/loyalty.service';
import { AddLoyaltyCustomerComponent } from '../../loyalty/add-loyalty-customer/add-loyalty-customer.component';
import { AttachCustomerDialogComponent } from '../attach-customer-dialog/attach-customer-dialog.component';

@Component({
  selector: 'app-point-of-sales-home',
  templateUrl: './point-of-sales-home.component.html',
  styleUrls: ['./point-of-sales-home.component.scss']
})

export class PointOfSalesHomeComponent implements OnInit {

  @ViewChild('barcode') barcode: ElementRef;

  mainMeals: Product[];
  sides: Product[];
  desserts: Product[];
  packages: Product[];
  dynamicProduct: Product[];
  saleOverview: SaleOverview[] = [];
  tabIndex: number;
  arrayIndex: number;
  vatPercentage: number;
  grandTotal: number;
  vatAmount: number;
  paymentDetails: IPaymentDialog;
  barcodeInput: string;
  branchID: number;
  employeeID: number;
  loadingMode: any;
  buttonDisabled: boolean;
  data: SaleData;
  customerName?: any;
  customerId?: any;
  customerEmail?: any;
  test: any;

  constructor(private saleService: SaleService, private snackBar: MatSnackBar, private router: Router, private userService: UserService,
              public dialog: MatDialog, private loyaltyService: LoyaltyService) {}

  ngOnInit(): void {
    this.buttonDisabled = false;
    this.branchID = this.userService.getBranchID();
    this.employeeID = this.userService.getUserID();

    this.loadingMode = 'query';
    this.saleService.getProducts(this.branchID).subscribe((res: any) => {
      this.mainMeals = res[0];
      this.sides = res[1];
      this.desserts = res[2];
      this.packages = res[3];
      this.loadingMode = 'determinate';
    }, error => {
      this.displayErrorMessage('Oops! Something went wrong.');
      this.loadingMode = 'determinate';
    });

    this.saleService.getVAT().subscribe((res: any) => {
      this.vatPercentage = res;
    });

    this.grandTotal = 0;
    this.vatAmount = 0;

    this.tabIndex = 0;
  }

  captureBarcode(barcode: any) {
    this.addToSale(barcode);
    this.barcodeInput = '';
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }

  addToSale(productCode: any) {
    this.dynamicProduct = [];
    if (this.tabIndex === 0) {
      this.arrayIndex = this.mainMeals.findIndex(zz => zz.productBarcode === productCode);
      this.dynamicProduct = this.mainMeals;
    } else if (this.tabIndex === 1) {
      this.arrayIndex = this.sides.findIndex(zz => zz.productBarcode === productCode);
      this.dynamicProduct = this.sides;
    } else if (this.tabIndex === 2) {
      this.arrayIndex = this.desserts.findIndex(zz => zz.productBarcode === productCode);
      this.dynamicProduct = this.desserts;
    } else if (this.tabIndex === 3) {
      this.arrayIndex = this.packages.findIndex(zz => zz.productBarcode === productCode);
      this.dynamicProduct = this.packages;
    }

    const index = this.saleOverview.findIndex(zz => zz.productBarcode === productCode);

    if (index === -1){
      this.saleOverview.push({
        productID: this.dynamicProduct[this.arrayIndex].productID,
        productName: this.dynamicProduct[this.arrayIndex].productName,
        quantity: 1,
        productPrice: this.dynamicProduct[this.arrayIndex].productPrice,
        productBarcode: this.dynamicProduct[this.arrayIndex].productBarcode
      });
      this.grandTotal += this.dynamicProduct[this.arrayIndex].productPrice;
    } else {
      this.saleOverview[index].quantity += 1;
      this.grandTotal += this.dynamicProduct[this.arrayIndex].productPrice;
    }

    this.vatAmount = this.grandTotal * (this.vatPercentage / 100);
  }

  removeFromSale(productCode: any) {

    console.log(this.voucherArray.length)
    if (this.saleOverview.length === 1) {
      for (let x = 0; x < this.voucherArray.length; x ++) {
        this.grandTotal += this.voucherArray[x].amount;
      }
      this.voucherArray = [];
      this.codeArray = [];
    }
    const index = this.saleOverview.findIndex(zz => zz.productBarcode === productCode);
    this.grandTotal -= (this.saleOverview[index].productPrice * this.saleOverview[index].quantity);
    this.vatAmount = this.grandTotal * (this.vatPercentage / 100);

    this.saleOverview = this.saleOverview.filter(zz => zz.productBarcode !== productCode);

    if (this.grandTotal <= 0) {
      for (let x = 0; x < this.voucherArray.length; x ++) {
        this.grandTotal += this.voucherArray[x].amount;
      }
      this.vatAmount = this.grandTotal * (this.vatPercentage / 100);
      this.voucherArray = [];
      this.codeArray = [];
    }
  }

  openDialog() {

    this.paymentDetails = {
      paymentType: 'Requesting',
      amount: this.grandTotal
    };

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '40vw',
      data: this.paymentDetails,
      disableClose: true
    });



    dialogRef.afterClosed().subscribe((response: IPaymentDialog) => {

      // Record Voucher Instances
      for (let x = 0; x < this.voucherArray.length; x ++) {

        const voucher = {
          amount: this.voucherArray[x].amount,
          newAmount: this.voucherArray[x].newAmount,
          instanceAmount: this.voucherArray[x].instanceAmount,
          id: this.voucherArray[x].id,
          code: this.voucherArray[x].code,
          afterAmount: this.voucherArray[x].afterAmount
        };

        this.loyaltyService.captureInstance(voucher).subscribe(response => {
          console.log('Instance captured successfully');
        }, error => [
          console.log('Unable to capture instance')
        ]);

      }

      this.voucherArray = [];
      this.codeArray = [];

      if (response) {

        this.data = {
          emailAddress: '',
          employeeID: this.employeeID,
          branchID: this.branchID,
          paymentType: response.paymentType,
          saleTotal: this.grandTotal,
          saleLines:  this.saleOverview,
          customerID: this.customerId
        };

        this.loadingMode = 'query';
        this.saleService.doSale(this.data).subscribe(res => {
          const confirm = this.dialog.open(ConfirmModalComponent, {
            disableClose: true,
            data: {
              message: 'Would you like a receipt?'
            }
          });
          this.loadingMode = 'determinate';

          confirm.afterClosed().subscribe(ok => {
            if (ok) {
              this.requestEmail();
            } else {
              this.saleOverview = [];
              this.grandTotal = 0;
              this.vatAmount = 0;
              this.buttonDisabled = false;
              this.customerName = null;
              this.customerEmail = null;
              this.customerId = null;
              this.buttonDisabled = true;
            }
          });
        }, error => {
          this.buttonDisabled = false;
          this.displayErrorMessage('Oops! Something went wrong.');
          this.loadingMode = 'determinate';
        });
      }
    });
  }

  requestEmail() {
    const confirm = this.dialog.open(RequestEmailComponent, {
      disableClose: true,
      data: {
        email: this.customerEmail
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.sendEmail(res);
        this.customerName = null;
        this.customerEmail = null;
        this.customerId = null;
        this.buttonDisabled = true;
      } else {
        this.saleOverview = [];
        this.grandTotal = 0;
        this.vatAmount = 0;
        this.buttonDisabled = false;
        this.customerName = null;
        this.customerEmail = null;
        this.customerId = null;
        this.buttonDisabled = true;
      }
    });
  }

  sendEmail(email: string) {
    const data: SaleData = {
      emailAddress: email,
      employeeID: this.employeeID,
      branchID: this.branchID,
      paymentType: this.data.paymentType,
      vatTotal: this.vatAmount,
      saleTotal: this.grandTotal,
      saleLines:  this.saleOverview,
    };

    this.loadingMode = 'query';
    this.saleService.emailReceipt(data).subscribe(res => {
      this.saleOverview = [];
      this.grandTotal = 0;
      this.vatAmount = 0;
      this.buttonDisabled = false;
      this.loadingMode = 'determinate';
      this.displaySuccessMessage('Success! Sale completed and receipt sent');
    }, error => {
      this.displayErrorMessage('Oops! Something went wrong.');
      this.loadingMode = 'determinate';
      this.buttonDisabled = false;
    });
  }

  displayErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }

  displaySuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  // Open Link Loyalty Member Dialog
  openLinkLoyalty() {
    const dialogRef = this.dialog.open(AddLoyaltyMemberComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Open Add Loyalty Member Dialog
  openAddLoyalty() {
    const dialogRef = this.dialog.open(AddLoyaltyCustomerComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Open View Loyalty Points Dialog
  openViewLoyaltyPoints() {
    const dialogRef = this.dialog.open(ViewLoyaltyPointsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Attach a Customer to the Sale

  attachCustomerDialogRef: MatDialogRef<AttachCustomerDialogComponent>;

  openAttachCustomer() {
    this.attachCustomerDialogRef = this.dialog.open(AttachCustomerDialogComponent, {
      width: '60vw',
      height: '60vh'
    });

    this.attachCustomerDialogRef.afterClosed().subscribe(result => {
      this.customerName = result.customerName + ' ' + result.customerSurname;
      this.customerId = result.customerId;
      this.customerEmail = result.customerEmail
    });
  }

  // Open Redeem Voucher Dialog
  openRedeemVoucher() {

    this.paymentDetails = {
      paymentType: 'Voucher',
      amount: this.grandTotal
    };

    const data: SaleData = {
      emailAddress: '',
      employeeID: this.employeeID,
      branchID: this.branchID,
      paymentType: this.paymentDetails.paymentType,
      saleTotal: this.grandTotal,
      saleLines:  this.saleOverview,
    };

    const dialogRef = this.dialog.open(RedeemVoucherComponent, {
      data: this.paymentDetails,
    });

    dialogRef.afterClosed().subscribe(response => {
      console.log(response);

      // If Vouchers value covered full sale amount, make sale and record instance
      if (response.afterAmount === 0 && !this.codeArray.includes(response.code)) {
        this.loadingMode = 'query';

        this.loyaltyService.captureInstance(response).subscribe(response => {
          console.log('Instance captured successfully');
        }, error => [
          console.log('Unable to capture instance')
        ])

        this.saleService.doSale(data).subscribe(res => {
          const confirm = this.dialog.open(ConfirmModalComponent, {
            disableClose: true,
            data: {
              message: 'Would you like a receipt?',
            }
          });
          this.loadingMode = 'determinate';

          confirm.afterClosed().subscribe(ok => {
            if (ok) {
              this.requestEmail();
            } else {
              this.saleOverview = [];
              this.grandTotal = 0;
              this.vatAmount = 0;
            }
          });
        }, error => {
          this.displayErrorMessage('Oops! Something went wrong.');
          this.loadingMode = 'determinate';
        });

        // If Vouchers value did not cover full sale amount, apply voucher,
        // and make voucher deletable (instance recorded once sale is made)
      } else if (response.afterAmount > 0 && !this.codeArray.includes(response.code)) {
        this.displaySuccessMessage('Voucher successfully applied');
        this.grandTotal = response.afterAmount;
        this.vatAmount = this.grandTotal * (this.vatPercentage / 100);
        this.addVoucherToSale(response);
      } else {
        this.displayErrorMessage('Voucher Has Already Been Applied');
      }

    }, error => {
      // Post server error (No legitimate reason for error)
      this.displayErrorMessage('Unable to apply voucher');
    });
  }

  voucherArray: any = [];
  codeArray: any = [];

  deleteVoucherFromSale(index: any) {
    if (index !== -1) {
      this.grandTotal = this.grandTotal + this.voucherArray[index].instanceAmount;
      this.vatAmount = this.grandTotal * (this.vatPercentage / 100);
      this.voucherArray.splice(index, 1);
      this.codeArray.splice(index, 1);
    }
    this.displayErrorMessage('Voucher Removed');
  }

  addVoucherToSale(voucher: any) {
    if (this.codeArray.includes(voucher.code)) {
      this.displayErrorMessage('Voucher Has Already Been Applied');
    } else {
      this.codeArray.push(voucher.code);
      this.voucherArray.push(voucher);
      console.log(this.voucherArray);
    }
  }
}
