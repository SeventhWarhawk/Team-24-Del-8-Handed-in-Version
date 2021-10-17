import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryService } from 'src/app/services/delivery.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IDelivery, IDeliverySplit, ISplit } from 'src/app/interfaces/delivery';
import { GenerateConfirmationComponent } from '../generate-confirmation/generate-confirmation.component';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-pending-deliveries',
  templateUrl: './generate-pending-deliveries.component.html',
  styleUrls: ['./generate-pending-deliveries.component.scss']
})
export class GeneratePendingDeliveriesComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatStepper;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private service: DeliveryService, private router: Router,
              private snackBar: MatSnackBar) { }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  deliveries: IDelivery[];
  selectedDeliveries: string[] = [];
  drivers: any;
  selectedDrivers: string[] = [];
  deliveryValidator: number;
  driverValidator: number;
  deliveryNext: boolean;
  driverNext: boolean;
  dragDrop: ISplit[] = [];
  addressObject: IDeliverySplit[] = [];

  ngOnInit() {

    this.service.getPendingDeliveries().subscribe((res: any) => {
      this.deliveries = res;
    });

    this.service.getDrivers().subscribe(res => {
      this.drivers = res;
    });

    this.firstFormGroup = this.fb.group({

    });
    this.secondFormGroup = this.fb.group({

    });
    this.deliveryValidator = 0;
    this.driverValidator = 0;
    this.deliveryNext = true;
    this.driverNext = true;
  }

  onDeliverySelect(event: MatCheckboxChange, deliveryID: any, deliveryAddress: string) {
    this.dragDrop = [];
    this.addressObject = [];

    const delivery = 'Delivery ID ' + deliveryID.toString() + ' - ' + deliveryAddress;
    if (event.checked) {
      this.deliveryValidator += 1;
      this.selectedDeliveries.push(delivery);
    } else {
      this.deliveryValidator -= 1;
      this.selectedDeliveries = this.selectedDeliveries.filter((zz: any) => zz !== delivery);
    }

    if (this.deliveryValidator > 0) {
      this.deliveryNext = false;
    } else {
      this.deliveryNext = true;
    }
  }

  onDriverSelect(event: MatCheckboxChange, driverID: string, driverName: string, driverSurname: string) {
    this.dragDrop = [];
    this.addressObject = [];

    const driver = 'Employee ID ' + driverID + ' - ' + driverName + ' ' + driverSurname;
    if (event.checked) {
      this.driverValidator += 1;
      this.selectedDrivers.push(driver);
    } else {
      this.driverValidator -= 1;
      this.selectedDrivers = this.selectedDrivers.filter((zz: any) => zz !== driver);
    }

    if (this.driverValidator > 0) {
      this.driverNext = false;
    } else {
      this.driverNext = true;
    }

    if (this.selectedDrivers.length > this.selectedDeliveries.length) {
      this.driverNext = true;
    } else {
      this.driverNext = false;
    }
  }

  doSplit() {
    this.dragDrop = [];

    let splitValidation = true;
    const result = this.splitToChunks(this.selectedDeliveries, this.selectedDrivers.length);

    let i = 0;
    this.selectedDrivers.forEach(element => {
      this.addressObject = [];
      result[i].forEach((splitAddress: any) => {
        this.addressObject.push({
          address: splitAddress
        });
      });
      this.dragDrop.push({
        driver: element,
        splitDeliveries: this.addressObject
      });
      i++;
    });

    this.dragDrop.forEach(element => {
      if (element.splitDeliveries.length > 10) {
        splitValidation = false;
      }
    });

    if (splitValidation) {
      this.nextClicked();
    } else {
      this.displayErrorMessage('Oops! Too many deliveries for the drivers.');
    }
  }

  splitToChunks(array: any, parts: any) {
    const result = [];
    const arrayToSplit = array.slice(0);
    for (let i = parts; i > 0; i--) {
        result.push(arrayToSplit.splice(0, Math.ceil(arrayToSplit.length / i)));
    }
    return result;
  }

  drop(event: CdkDragDrop<IDeliverySplit[]>) {
    if (event.previousContainer.data.length !== 1){
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      }
    } else {
      this.displayErrorMessage('Oops! Driver cannot have no deliveries.');
    }
  }

  nextClicked() {
    this.myStepper.selected.completed = true;
    this.myStepper.next();
  }

  openDialog() {
    const dialogRef = this.dialog.open(GenerateConfirmationComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.service.generatePendingDeliveries(this.dragDrop).subscribe(res => {
          this.displaySuccessMessage('Success! Pending deliveries generated.');
          this.router.navigateByUrl('admin-home/admin-dashboard');
        }, (error: any) => {
          this.displayErrorMessage('Oops! Something went wrong.');
        });
      }
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
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }
}
