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
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/interfaces/admin';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-product-trends-report',
  templateUrl: './product-trends-report.component.html',
  styleUrls: ['./product-trends-report.component.scss']
})
export class ProductTrendsReportComponent implements OnInit {

  // NAVBAR REQUIREMENTS
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  constructor(private fb: FormBuilder, private http: HttpClient, private service: ReportService, public dialog: MatDialog,
    private router: Router, public userService: UserService, private snack: MatSnackBar) {
    this.svc = userService;
    this.userName = this.userInfo.displayName;
  }
  userName = '';
  displayName = '';
  svc: any;

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
  date = new Date();
  all: any;
  observeCategories: Observable<Branch[]> = this.service.getBranches();
  categoryData: Branch[];
  tableData: any;
  branchName = '';
  avg = 0;
  tot = 0;
  count = 0;
  reportParams: StockReportParameters;
  filterForm!: FormGroup;
  public categoryList: Branch[] = [];
  created = false;
  displayedColumns: string[] = ['date', 'ProductName', 'Reason', 'Quantity'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Quantity Sold'
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
  barChartLabels: Label[] = this.service.labels;
  barChartType: Chart.ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: Chart.ChartDataSets[] = [
    { data: this.service.data, label: 'Quantity Sold' }
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
      this.categoryData.push(
        {
          BranchId: -1,
          BranchName: "All"
        });
      this.categoryData.reverse();
      console.log(this.categoryData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }
  generateReport(input: any) {
    this.reportParams = this.filterForm.value;
    this.service.writeOffHistory(this.filterForm.value).subscribe(res => {
      this.dataSource.data = res;
      console.log(res);
    });
    this.service.getProductQuantities(this.filterForm.value).subscribe(res => {
      console.log('HI');
      this.tableData = res;
      console.log(res);
      //this.service.labels = [];
      for (const item of res) {
        this.service.labels.push(item.product_name);
        this.service.data.push(item.quantity);
        this.tot += item.quantity;
        this.count += 1;
      }
      this.avg = Math.round(this.tot / this.count);
      console.log(this.service.labels);
    });
    this.created = true;
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
      PDF.save('ProductTrendsReport.pdf');
    });
  }
}
