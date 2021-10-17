import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from 'src/app/services/report/report.service';
import { ChartOptions, ChartType, ChartDataSets, ChartHoverOptions, ChartTooltipOptions } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { BranchService } from 'src/app/services/branch.service';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  branch = 'loading...';
  userInfo = JSON.parse(localStorage.getItem('userInfo')!);
  lineCreated = false;
  doughnutCreated = false;
  admin = false;
  activity: any;
  branchName = localStorage['branch'];

  // Get Time for Welcome Message
  date = new Date();
  currentMonth = this.date.toLocaleString('default', { month: 'long' });
  currentDay = this.date.getUTCDate();
  currentDayWord = this.date.toLocaleDateString('en-us', { weekday: 'long' });

  // Graph
  cards: any[] = [];
  currentDates = [];
  previousDates = [];
  cardsForHandset = [];
  cardsForWeb = [];
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  lineChartData: Chart.ChartDataSets[];


  isHandset = false;
  isHandsetObserver: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return true;
      }
      return false;
    })
  );

  roles: string[] = [];

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 1000
        },
        scaleLabel: {
          display: true,
          labelString: 'Sales Total (R)'
        }
      }]
    },
  };

  lineChartLabels: Label[] = this.labels;
  lineChartType: Chart.ChartType = 'line';
  lineChartLegend = true;
  lineChartPlugins = [];

  doughnutChartLabels: Label[];
  doughnutChartData: MultiDataSet;
  doughnutChartLegend: false;
  doughnutChartType: ChartType = 'doughnut';

  constructor(public dialog: MatDialog, private service: ReportService, public adminService: AdminService,
    public branchService: BranchService, public userService: UserService, private breakpointObserver: BreakpointObserver,
    public appService: AppService) { this.roles = this.userInfo.roles; }

  ngOnInit(): void {
    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == 'Admin') {
        this.admin = true;
      }
    }
    this.getAudits();
    this.getBranchName();

    const branchID = this.userService.getBranchID();

    this.service.getSales(branchID).subscribe((res: any) => {
      this.currentDates = res[0];
      this.previousDates = res[1];
      this.lineChartData = [
        // tslint:disable-next-line: max-line-length
        { data: res[0], label: 'Current Week', backgroundColor: '#98DDCA', borderColor: '#1C00ff00', pointBackgroundColor: '#98DDCA', pointHitRadius: 50},
        { data: this.previousDates, label: 'Previous Week', backgroundColor: '#2F5D62', borderColor: '#1C00ff00', pointBackgroundColor: '#2F5D62', pointHitRadius: 50}
      ];
      this.lineCreated = true;
    });

    this.service.getPopularProducts(branchID).subscribe((res: any) => {
      console.log(res);
      this.doughnutChartLabels = res[0];
      this.doughnutChartData = res[1];
      this.doughnutCreated = true;
    });
  }

  getBranchName() {
    const branchId = JSON.parse(localStorage.getItem('branch')!);
    return this.branchService.getBranchName(branchId)
      .subscribe((res: any) => {
        this.branch = res.branchName;
      });
  }

  getAudits() {
    this.adminService.getAuditsToday().subscribe(res => {
      this.activity = res;
      console.log(res);
    });
  }
}
