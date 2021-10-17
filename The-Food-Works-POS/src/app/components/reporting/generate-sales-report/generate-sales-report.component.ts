import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Branch, CategorySalesVM, DailySales, SalesReportParameters, StockReportParameters } from 'src/app/interfaces/report';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/services/report/report.service';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sale, TodaySalesVM } from 'src/app/interfaces/sale';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-generate-sales-report',
  templateUrl: './generate-sales-report.component.html',
  styleUrls: ['./generate-sales-report.component.scss']
})
export class GenerateSalesReportComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient, private service: ReportService, public dialog: MatDialog,
    private router: Router, public userService: UserService, private snack: MatSnackBar) {
    this.filterForm = new FormGroup({
      BranchId: new FormControl(this.categoryData)
    });
  }

  //cats
  cats: CategorySalesVM[];
  mainCount = 0;
  sideCount = 0;
  dessertCount = 0;
  packageCount = 0;
  //----------
  viewUserRole: any;
  UserRoles: any;
  displayedColumns: string[] = ['custName', 'empName', 'completionMethod', 'saleType', 'paymentType', 'saleTotal'];
  dataSource = new MatTableDataSource<TodaySalesVM[]>();
  displayedColumns2: string[] = ['main', 'side', 'dessert', 'package'];
  dataSource2 = new MatTableDataSource<CategorySalesVM>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // --------------
  date = new Date();
  all: any;
  observeCategories: Observable<Branch[]> = this.service.getBranches();
  categoryData: Branch[];
  branches = this.service.getBranches();
  tableData: any;
  graphData: any;
  branchName = '';
  reportParams: SalesReportParameters;
  filterForm!: FormGroup;
  filterGroup = this.fb.group({
    BranchId: [null, Validators.required]
  });

  public categoryList: Branch[] = [];
  created = false;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Accumulated Sales (R)'
        }
      }],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        },
      ],
    },
  };
  barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  barChartType: Chart.ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: Chart.ChartDataSets[] = [

    { data: this.service.y5, label: '2019' },
    { data: this.service.y6, label: '2020' },
    { data: this.service.y7, label: '2021' },
  ];



  ngOnInit() {
    this.filterForm = this.fb.group({
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
    this.reportParams = this.filterForm.value;
  }

  generateReport(input: any) {
    this.reportParams = this.filterForm.value;
    for (let i = 0; i < this.categoryData.length; i++) {
      if (this.reportParams.BranchId == this.categoryData[i].BranchId) {
        this.branchName = this.categoryData[i].BranchName;
      }
    }
    if (this.branchName == "") {
      this.branchName = "ALL";
    }
    this.getAllSales(this.filterForm.value);
    this.getCategorySales(this.filterForm.value);
    this.service.getAccumulatedSales(this.filterForm.value).subscribe(data => {
      this.graphData = data;
      for (const item of data) {
        if (item.Year === 2015) {
          this.service.y1.push(item.SaleTotal);
        }
        if (item.Year === 2016) {
          this.service.y2.push(item.SaleTotal);
        }
        if (item.Year === 2017) {
          this.service.y3.push(item.SaleTotal);
        }
        if (item.Year === 2018) {
          this.service.y4.push(item.SaleTotal);
        }
        if (item.Year === 2019) {
          this.service.y5.push(item.SaleTotal);
        }
        if (item.Year === 2020) {
          this.service.y6.push(item.SaleTotal);
        }
        if (item.Year === 2021) {
          this.service.y7[item.Month] = item.SaleTotal;
        }
      }
    });
    this.created = true;
  }
  @ViewChild('htmlData') htmlData: ElementRef | any;

  public openPDF() {
    const Data = document.getElementById('content')!;
    // Canvas Options
    html2canvas(Data).then(div => {
      const fileWidth = 180;
      const fileHeight = div.height * fileWidth / div.width;
      const contentDataURL = div.toDataURL('image/png');

      const PDF = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const topPosition = 8;
      const leftPosition = 0;
      PDF.addImage(contentDataURL, 'PNG', leftPosition, topPosition, fileWidth, fileHeight);
      PDF.save('SalesReport.pdf');
    });
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  count = 0;
  dailyTotal = 0;
  getAllSales(form: any) {
    var branchId = form.BranchId;
    this.service.getAllSales(branchId).subscribe(res => {
      this.dataSource.data = res;
      console.log(res);
      for (var i = 0; i < this.dataSource.data.length; i++) {
        if (this.dataSource.data.length != 0) {
          this.count = 1 + i;
        }
        this.dailyTotal += res[i].saleTotal;
      }
    });
  }

  getCategorySales(form: any) {
    var branchId = form.BranchId;
    this.service.getCategorySales(branchId).subscribe(res => {
      this.dataSource2.data = res;
      this.cats = res;
      console.log(res);
      this.mainCount = res.mainCount;
      this.sideCount = res.sideCount;
      this.dessertCount = res.dessertCount;
      this.packageCount = res.packageCount;
    });
  }

}
