import { BranchService } from 'src/app/services/branch.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Branch, DailySales, SalesReportParameters, StockReportParameters } from 'src/app/interfaces/report';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/services/report/report.service';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-branch-report',
  templateUrl: './branch-report.component.html',
  styleUrls: ['./branch-report.component.scss']
})
export class BranchReportComponent implements OnInit {

  created = false;
  total = 0;
  complete = 0;
  incomplete = 0;
  totalQuantRequested = 0;
  avgQRequested = 0;
  totalRequestLines = 0;
  avgRequestLines = 0;
  prods = 0;
  // NAVBAR REQUIREMENTS
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  constructor(private fb: FormBuilder, private http: HttpClient, private service: ReportService, public dialog: MatDialog,
    private router: Router, public userService: UserService, private snack: MatSnackBar, public branchService: BranchService) {
    this.svc = userService;
    this.userName = this.userInfo.displayName;
  }
  userName = '';
  displayName = '';
  svc: any;
  date = new Date();
  getUserName() {
    if (this.displayName == null || undefined) {
      this.router.navigateByUrl('login');
      return 'dummy';
    }
    else if (this.displayName != null) {
      return this.displayName!;
    }
    else
      return this.svc.userInfo.displayName;
  }


  // --------------
  observeCategories: Observable<Branch[]> = this.service.getBranches();
  categoryData: Branch[];
  tableData: any;
  requests: any;
  branchName = '';
  reportParams: StockReportParameters;
  filterForm!: FormGroup;
  public categoryList: Branch[] = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Quantity on Hand'
        }
      }],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Product',
          },
        },
      ],
    },
  };
  barChartLabels: Label[] = this.service.requestLabels;
  barChartType: Chart.ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: Chart.ChartDataSets[] = [
    { data: this.service.requestData, label: 'Quantity on Hand' }
  ];

  @ViewChild('htmlData') htmlData: ElementRef | any;

  ngOnInit() {
    this.filterForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      BranchId: [null, Validators.required]
    });
    this.observeCategories.subscribe(data => {
      this.categoryData = data;
      console.log(this.categoryData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }
  generateReport(input: any) {
    // TABLES
    this.reportParams = this.filterForm.value;
    this.service.getBranchRequests(this.filterForm.value).subscribe(res => {
      this.requests = res;
      for (var i = 0; i < this.requests.length; i++) {
        this.total += 1;
        if (this.requests[i].Status.requestStatusDescription == "Complete") {
          this.complete += 1;
        }
        if (this.requests[i].Status.requestStatusDescription == "Requested") {
          this.incomplete += 1;
        }
        //this.totalQuantRequested += this.requests[i].RequestLines.Quantity;
        for (var x = 0; x < this.requests[i].RequestLines.length; x++) {
          this.totalRequestLines += 1;
          this.totalQuantRequested += this.requests[i].RequestLines[x].Quantity;
        }
        this.avgRequestLines = Math.round((this.totalRequestLines / this.requests[i].RequestLines.length));
        //this.avgQRequested = Math.round(this.totalQuantRequested / this.requests[i].RequestLines.length);
      }
      this.avgQRequested = Math.round(this.totalQuantRequested / this.totalRequestLines);
      this.avgRequestLines = Math.round(this.totalRequestLines / this.requests.length);

    });
    this.service.getProductTableReportData(this.filterForm.value).subscribe(res => {
      console.log(res);
      for (const i of res) {
        this.service.requestLabels.push(i.ProductName);
        this.service.requestData.push(i.QuantityOnHand);
      }
      console.log(this.service.requestData);
      this.created = true;
    });
    return this.branchService.getBranchName(this.reportParams.BranchId)
      .subscribe((res: any) => {
        this.branchName = res.branchName;
      });
    //     for (const item of i.RequestLines)
    //     {
    //       this.service.requestLabels.push(item.ProductName);
    //       console.log(this.service.requestLabels);
    //       this.service.requestData.push(item.RequestLines.Quantity);
    //       }
    //   }
    //   this.created = true;
    // });
  }

  public openPDF() {
    // tslint:disable-next-line:no-non-null-assertion
    const Data = document.getElementById('content')!;
    // Canvas Options
    html2canvas(Data).then(div => {
      const fileWidth = 210;
      const fileHeight = div.height * fileWidth / div.width;
      const contentDataURL = div.toDataURL('image/png');

      const PDF = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const topPosition = 8;
      const leftPosition = 0;
      PDF.addImage(contentDataURL, 'PNG', leftPosition, topPosition, fileWidth, fileHeight);
      PDF.save('BranchReport.pdf');
    });
  }
}

