import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IOrderLine } from 'src/app/interfaces/order';
import { IPaymentData, IPaymentDialog } from 'src/app/interfaces/payment';
import { SaleData } from 'src/app/interfaces/sale';
import { OrderService } from 'src/app/services/order.service';
import { SaleService } from 'src/app/services/sale.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { RequestEmailComponent } from '../../modals/request-email/request-email.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.scss']
})
export class CompleteOrderComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('qrCode') qrCode: ElementRef;

  displayedColumns: string[] = ['quantity', 'productName', 'productPrice', 'lineTotal'];
  dataSource = new MatTableDataSource<IOrderLine>();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  orderLines: IOrderLine[] = [];
  splitCode = [];
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  orderDetails: any;
  customerDetails: any;
  isPaid: boolean;
  paymentDetails: IPaymentDialog;
  isLoading = false;
  loadingMode: any;
  data: IPaymentData;
  branchID: number;
  employeeID: number;
  customerEmail: any;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private service: OrderService, public router: Router,
              private snackBar: MatSnackBar, private userService: UserService, private saleService: SaleService) { }

  ngOnInit() {
    this.firstFormGroup = this.fb.group({ });
    this.secondFormGroup = this.fb.group({ });
    this.thirdFormGroup = this.fb.group({ });

    this.branchID = this.userService.getBranchID();
    this.employeeID = this.userService.getUserID();

    this.service.getVAT();
    this.onBlur();
  }

  captureQRCode(qrCode: any) {
    this.loadingMode = 'query';
    this.isPaid = true;
    this.subtotal = 0;
    this.vatAmount = 0;
    this.grandTotal = 0;
    this.splitCode = qrCode.split(':');
    if (this.splitCode[0] === 'or'){
      this.loadingMode = 'query';
      this.service.getOrder(this.splitCode[1]).subscribe(res => {
        this.orderDetails = res;
        this.orderLines = res.orderLines;
        this.dataSource.data = this.orderLines;

        this.orderLines.forEach(element => {
          this.grandTotal += (element.productPrice * element.quantity);
        });
        this.vatAmount = (this.grandTotal * (this.service.vatPercentage / 100));
        this.subtotal = this.grandTotal - this.vatAmount;

        if (res.paymentMethod === 'Not Paid') {
          this.isPaid = false;
        }

        // tslint:disable-next-line: no-shadowed-variable
        this.service.getCustomerDetails(this.splitCode[2]).subscribe(res => {
          this.customerDetails = res;
          this.customerEmail = res.customerEmail;
          this.loadingMode = 'determinate';
          this.myStepper.selected.completed = true;
          this.myStepper.next();
        }, error => {
          this.displayErrorMessage('Oops! Something went wrong.');
          this.loadingMode = 'determinate';
        });
      }, error => {
        this.displayErrorMessage('Oops! Order was already collected.');
        this.loadingMode = 'determinate';
      });
    } else {
      this.displayErrorMessage('Oops! Not a valid QR code.');
      this.loadingMode = 'determinate';
    }
  }

  onBlur() {
    setTimeout(() => this.qrCode.nativeElement.focus(), 0);
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
      if (response) {
        this.data = {
          saleID: this.orderDetails.orderID,
          paymentType: response.paymentType,
          amount: this.grandTotal
        };

        this.isLoading = true;
        this.loadingMode = 'query';
        this.service.makePayment(this.data).subscribe(res => {
          this.isLoading = false;
          this.displaySuccessMessage('Success! Order paid for and completed.');
          this.loadingMode = 'determinate';
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
              this.router.navigateByUrl('point-of-sales-home');
            }
          });
        }, error => {
          this.isLoading = false;
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
      } else {
        this.router.navigateByUrl('point-of-sales-home');
      }
    });
  }

  sendEmail(email: string) {
    const data = {
      emailAddress: email,
      employeeID: this.employeeID,
      branchID: this.branchID,
      paymentType: this.data.paymentType,
      vatTotal: this.vatAmount,
      saleTotal: this.grandTotal,
      saleLines:  this.orderLines
    };

    this.loadingMode = 'query';
    this.saleService.emailReceipt(data).subscribe(res => {
      this.loadingMode = 'determinate';
      this.displaySuccessMessage('Success! Receipt sent');
      this.router.navigateByUrl('point-of-sales-home');
    }, error => {
      this.displayErrorMessage('Oops! Something went wrong.');
      this.loadingMode = 'determinate';
      this.router.navigateByUrl('point-of-sales-home');
    });
  }

  doComplete() {
    this.isLoading = true;
    this.loadingMode = 'query';
    this.service.completeOrder(this.orderDetails.orderID).subscribe(res => {
      this.isLoading = false;
      this.displaySuccessMessage('Success! Order has been completed.');
      this.router.navigateByUrl('point-of-sales-home');
      this.loadingMode = 'determinate';
    }, error => {
      this.isLoading = false;
      this.displayErrorMessage('Oops! Something went wrong.');
      this.loadingMode = 'determinate';
    });
  }

  nextClicked() {
    this.myStepper.selected.completed = true;
    this.myStepper.next();
  }

  displayErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }

  displaySuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }
}
