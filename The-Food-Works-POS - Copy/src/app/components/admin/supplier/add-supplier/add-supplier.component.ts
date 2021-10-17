import { SupplierService } from './../../../../services/supplier.service';
import { OrderDay, OrderMethods, Supplier, SupplierCombined, SupplierTypes } from './../../../../interfaces/supplier';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { finalize, last, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {

  // Data Members and Methods for Google Maps Places API
  supplier: any; address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  streetName: any; streetAddress: any; province: any; suburb: any; country: any; city: any; zip: any; // Displayed

  // addressOptions = {
  //   componentRestrictions: { country: "za" },
  //   types: ["address"]
  // } as Options;
  selectedOption: number;
  selectedOptionMethod: number;

  valSupplierOrderDayIdue: number;
  SupplierOrderDayDescription: string;

  typesData: SupplierTypes[];
  observeTypes: Observable<SupplierTypes[]> = this.SupplierService.getSupplierTypes();
  methodsData: OrderMethods[];
  observeMethods: Observable<OrderMethods[]> = this.SupplierService.getOrderMethods();

  alldays: OrderDay[] = [
    { SupplierOrderDayId: 1, SupplierOrderDayDescription: 'Monday', checked: false },
    { SupplierOrderDayId: 2, SupplierOrderDayDescription: 'Tuesday', checked: false },
    { SupplierOrderDayId: 3, SupplierOrderDayDescription: 'Wednesday', checked: false },
    { SupplierOrderDayId: 4, SupplierOrderDayDescription: 'Thursday', checked: false },
    { SupplierOrderDayId: 5, SupplierOrderDayDescription: 'Friday', checked: false },
    { SupplierOrderDayId: 6, SupplierOrderDayDescription: 'Saturday', checked: false },
    { SupplierOrderDayId: 7, SupplierOrderDayDescription: 'Sunday', checked: false }
  ];


  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private SupplierService: SupplierService) { }
  isEditable = true;

  SupplierDetailsForm: FormGroup = new FormGroup({
    SupplierName: new FormControl("", [Validators.required]),
    SupplierVatNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    SupplierContactNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    SupplierEmailAddress: new FormControl("", [Validators.required, Validators.email]),
    //OrderMethodName:  new FormControl("", Validators.required),
    //SupplierType:  new FormControl("", Validators.required),
  });

  ngOnInit(): void {
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
  }

  type: number;
  method: number;

  getTypeid(selected: number) {
    this.type = selected;
  }

  getMethodid(selected: number) {
    this.method = selected;
  }

  suppliers: Supplier;
  openDialog() {
    this.suppliers = this.SupplierDetailsForm.value;
    this.suppliers.SupplierTypeId = this.type;
    this.suppliers.OrderMethodId = this.method;
    this.suppliers.days = this.dayList;
    if(this.dayList == null)
    {
      this._snackBar.open("At least one supplier order day must be selected!", "OK");
    }
    else
    {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          heading: 'Confirm Supplier Addition',
          message: 'Are you sure you would like to confirm this addition?'
        }
      });
      confirm.afterClosed().subscribe(r => {
        if(r)
        {
          console.log("This is supplier ", this.suppliers)
          this.SupplierService.addSupplier(this.suppliers).subscribe(res => {

            console.log("This is a res test - check success modal", res);
            const success = this.dialog.open(SuccessModalComponent, {
              disableClose: true,
              data: {
                heading: 'Supplier Successfully Added',
                message: 'This supplier has been successfully added!'
              }
            });

            success.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
            });
          },
          (error: HttpErrorResponse) => {
            console.log(error)
            if (error.status === 400) {
              console.log("ERROR")
              this._snackBar.open("This supplier already exists in the database!", "OK");
            }
          });
        }

      })
    }

  };

  dayVal: string;
  //dayList: OrderDay[] = [];
  dayList: string[];

  oneDay: OrderDay = {
    SupplierOrderDayDescription: "",
  };
  temp: OrderDay;

  getCheckboxes() {
    this.dayList = this.alldays.filter(x => x.checked === true).map(x => x.SupplierOrderDayDescription);
    console.log("TESTING DAYLIST",this.dayList);

  }

  change(event: MatCheckboxChange) {
  }

  onChange(event: any) {
    this.cd.detectChanges();
  }


}
