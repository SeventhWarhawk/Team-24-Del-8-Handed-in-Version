import { BranchService } from 'src/app/services/branch.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import 'pdfmake/build/vfs_fonts';
import { Component, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Branch, StockReportParameters } from 'src/app/interfaces/report';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/services/report/report.service';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/services/admin/admin.service';
import { Product } from 'src/app/interfaces/admin';

@Component({
  selector: 'app-ingredient-report',
  templateUrl: './ingredient-report.component.html',
  styleUrls: ['./ingredient-report.component.scss']
})
export class IngredientReportComponent implements OnInit {
  constructor(public adminService: AdminService, public BranchService: BranchService, public serv: ReportService, private router: Router, private fb: FormBuilder, private http: HttpClient, private service: ReportService, public dialog: MatDialog,
    private snack: MatSnackBar) {
  }
  date = new Date();

  all: any;
  observeCategories: Observable<Branch[]> = this.service.getBranches();
  categoryData: Branch[];
  tableData: any;
  branchName = '';
  total = 0;
  ingredientTableData: any;
  reportParams: StockReportParameters = {
    BranchId: 0,
    startDate: 2019 / 0o1 / 0o1,
    endDate: 2022 / 0o1 / 0o1

  };
  public categoryList: Branch[] = [];
  created = false;



  observeBranches: Observable<Branch[]> = this.serv.getBranches();
  selectedOption: number;
  TypeIDSend: number = 0;
  selectedContents: any
  temp: number[] = [];
  viewProduct: any;
  branchData: Branch[];
  displayedColumns: string[] = ['ProductName', 'ProductStatus', 'QOH'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingMode: any;


  selected = new FormControl(false);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.observeCategories.subscribe(data => {
      this.categoryData = data;
      this.categoryData.push(
        {
          BranchId: -1,
          BranchName: "All"
        });
      this.categoryData.reverse();
      console.log(this.categoryData);
      console.log(this.categoryData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  generateReport() {
    this.total = 0;
    for (let i = 0; i < this.categoryData.length; i++) {
      if (this.reportParams.BranchId == this.categoryData[i].BranchId) {
        this.branchName = this.categoryData[i].BranchName;
      }
    }
    if (this.branchName == "") {
      this.branchName = "ALL";
    }
    // this.service.getProductTableReportData(this.reportParams).subscribe(res => {
    //   for (const item of res) {
    //     this.total += item.ValueOnHand;
    //   }
    //   console.log(res);
    //   this.tableData = res;
    // });
    this.service.getIngredientTableReportData(this.reportParams).subscribe(data => {
      console.log(data);
      this.ingredientTableData = data;
      for (var i = 0; i < this.ingredientTableData.length; i++) {
        this.total += 1;
      }
    });
    this.created = true;
  }

  public openPDF(action = 'open') {
    // tslint:disable-next-line:no-non-null-assertion
    const Data = document.getElementById('content')!;

    // pdfMake.createPdf(docDefinition).open();
    // Canvas Options
    html2canvas(Data).then(div => {
      const fileWidth = 210;
      const fileHeight = div.height * fileWidth / div.width;
      const contentDataURL = div.toDataURL('src/assets/images/Food works.jpg');
      const PDF = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const topPosition = 8;
      const leftPosition = 0;
      // PDF.addImage(contentDataURL, 0, 0, 208, fileHeight);
      PDF.addImage(contentDataURL, 'JPEG', leftPosition, topPosition, fileWidth, fileHeight);
      PDF.save('IngredientsReport.pdf');
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Leaving already?',
        message: 'Are you sure you want to log out?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.router.navigateByUrl('/login');
        console.log('hi');
      }
      else {
        console.log('BAD');
      }
    });
  }
}

