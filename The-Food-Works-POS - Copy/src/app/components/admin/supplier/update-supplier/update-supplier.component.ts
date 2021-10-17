import { SupplierService } from './../../../../services/supplier.service';
import { OrderDay, OrderMethods, Supplier, SupplierCombined, SupplierStatus, SupplierTypes } from './../../../../interfaces/supplier';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { finalize, last, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.scss']
})
export class UpdateSupplierComponent implements OnInit {
  selectedOption = this.data.SupplierTypeId;
  selectedOptionMethod = this.data.OrderMethodName;

  valSupplierOrderDayIdue: number;
  SupplierOrderDayDescription: string;

  suppliers: Supplier;
  typesData: SupplierTypes[];
  statusesData: SupplierStatus[];
  observeTypes: Observable<SupplierTypes[]> = this.SupplierService.getSupplierTypes();
  methodsData: OrderMethods[];
  observeMethods: Observable<OrderMethods[]> = this.SupplierService.getOrderMethods();
  observeStatuses: Observable<SupplierStatus[]> = this.SupplierService.getStatuses();


  alldays: OrderDay[] = [
    { SupplierOrderDayId: 1, SupplierOrderDayDescription: 'Monday', checked: false },
    { SupplierOrderDayId: 2, SupplierOrderDayDescription: 'Tuesday', checked: false },
    { SupplierOrderDayId: 3, SupplierOrderDayDescription: 'Wednesday', checked: false },
    { SupplierOrderDayId: 4, SupplierOrderDayDescription: 'Thursday', checked: false },
    { SupplierOrderDayId: 5, SupplierOrderDayDescription: 'Friday', checked: false },
    { SupplierOrderDayId: 6, SupplierOrderDayDescription: 'Saturday', checked: false },
    { SupplierOrderDayId: 7, SupplierOrderDayDescription: 'Sunday', checked: false }
  ];

  constructor(public dialogRef: MatDialogRef<UpdateSupplierComponent>, private _snackBar: MatSnackBar, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Supplier, private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private SupplierService: SupplierService) { }
  isEditable = true;

  SupplierDetailsForm: FormGroup = new FormGroup({
    SupplierName: new FormControl("", [Validators.required]),
    SupplierVatNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    SupplierContactNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    SupplierEmailAddress: new FormControl("", [Validators.required, Validators.email]),
    SupplierStatuses : new FormControl("", Validators.required),
  });

  tempdays:string[] = [];

  ngOnInit(): void {
    this.SupplierDetailsForm.patchValue({
      SupplierName: this.data.SupplierName,
      SupplierVatNumber: this.data.SupplierVatNumber,
      SupplierContactNumber: this.data.SupplierContactNumber,
      SupplierEmailAddress: this.data.SupplierEmailAddress,
      OrderMethodName: this.data.OrderMethodName,
      SupplierStatuses: this.data.SupplierStatusId,
    });

    this.method = this.method = Number(this.data.OrderMethodName);
    //GET CURRENT ORDER DAYS
    this.tempdays = this.data.days!;

    for(let i = 0; i < this.alldays.length; i++)
    {
      if(this.tempdays.includes(this.alldays[i].SupplierOrderDayDescription))
      {
        console.log("IF STATEMENT")
        this.alldays[i].checked = true;
      }
    }

    this.observeTypes.subscribe(data => {
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    this.observeMethods.subscribe(data => {
      this.methodsData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    this.observeStatuses.subscribe(data => { //PRODUCT STATUSES
      this.statusesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  type: number;
  method: number;
  status: number;

  getTypeid(selected: number) {
    this.data.SupplierTypeId = selected;
  }

  getMethodid(selected: number) {
    this.data.OrderMethodName = selected.toString();
    this.method = Number(this.data.OrderMethodName);
  }

  getStatusid(selected: number) {
    this.data.SupplierStatusId = selected;
  }


  openDialog() {
    this.getCheckboxes();

    this.suppliers = this.SupplierDetailsForm.value;
    this.suppliers.SupplierId = this.SupplierService.supplierId;
    this.suppliers.SupplierTypeId = this.data.SupplierTypeId;
    this.suppliers.SupplierStatusId = this.data.SupplierStatusId;
    this.suppliers.OrderMethodId = this.method;
    this.suppliers.days = this.dayList;

    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Supplier Update',
        message: 'Are you sure you would like to update this supplier?'
      }
    });
    confirm.afterClosed().subscribe(r => {
      if(r)
      {
        console.log("This is supplier ", this.suppliers)
        this.SupplierService.updateSupplier(this.suppliers).subscribe(r => {
          const success = this.dialog.open(SuccessModalComponent, {
            disableClose: true,
            data: {
              heading: 'Supplier Successfully Updated',
              message: 'This supplier has been successfully updated!'
            }
          });

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
             this.dialogRef.close();
             window.location.reload();

          });
        },
        (error: HttpErrorResponse) => {
          console.log(error)
          if (error.status === 400) {
            console.log("ERROR")
            this._snackBar.open("At least one order day must be selected for this supplier!", "OK");
          }
        });
      }

    })
  }


  dayList: string[];
  getCheckboxes() {
    this.dayList = this.alldays.filter(x => x.checked === true).map(x => x.SupplierOrderDayDescription);
    console.log("TESTING DAYLIST",this.dayList);
  }

  onChange(event: any) {
    this.cd.detectChanges();
  }

  onCancel()
  {
    this.dialogRef.close();
  }
}
