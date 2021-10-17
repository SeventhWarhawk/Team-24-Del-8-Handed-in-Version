import { SalesReportParameters, StockReportParameters, DailySales, AccumulatedSales } from './../../interfaces/report';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/interfaces/report';
import { map } from 'rxjs/operators';
import { Sale } from 'src/app/interfaces/sale';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  // sales chart arrays
  public y1: any = [];
  public y2: any = [];
  public y3: any = [];
  public y4: any = [];
  public y5: any = [];
  public y6: any = [];
  public y7: any = [];

  // admin dashboard
  public b1: any = [];
  public b2: any = [];
  public b3: any = [];
  public b4: any = [];
  public b5: any = [];
  public b6: any = [];
  public b7: any = [];
  public b8: any = [];
  public b9: any = [];


  // product trends array
  public data: any = [];
  public requestData: any = [];
  public requestLabels: any = [];
  public labels: any = [];
  server = 'https://localhost:44325/';
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    withCredentials: true,
    observe: 'response' as 'body',
  };

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.server}Report/GetBranches`);
  }

  // ---------------STOCK REPORT-----------
  getProductTableReportData(branchSelection: StockReportParameters) {
    return this.http.post<any>(`${this.server}Report/ReportBranchProductStock`, branchSelection);
  }
  getIngredientTableReportData(branchSelection: StockReportParameters) {
    return this.http.post<StockReportParameters>(`${this.server}Report/ReportBranchProductIngredients`, branchSelection);
  }
  // ---------SALES REPORT-------------
  GetReportData(data: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(`${this.server}Report/ReportDailySales`, data);
  }
  getDailySales(branchSelection: SalesReportParameters) {
    return this.http.post<StockReportParameters>(`${this.server}Report/ReportDailySales`, branchSelection);
  }

  getAllSales(branchID: number): Observable<any> {
    const JSONObjectToSend = { 'branchId': branchID };
    return this.http.post<number>(`${this.server}Report/GetAllSales`, JSONObjectToSend);
  }

  getCategorySales(branchID: number): Observable<any> {
    const JSONObjectToSend = { 'branchId': branchID };
    return this.http.post<number>(`${this.server}Report/GetCategorySales`, JSONObjectToSend);
  }
  // Sales chart
  getAccumulatedSales(branchSelection: SalesReportParameters) {
    return this.http.post<any>(`${this.server}Report/ReportAccumulatedSales`, branchSelection);
  }

  // --------PRODUCT TRENDS REPORT---------
  getProductQuantities(branchSelection: any) {
    return this.http.post<any>(`${this.server}Report/ReportProductTrends`, branchSelection);
  }
  // --------BRANCH REPORT -------------
  getBranchRequests(branchSelection: StockReportParameters): Observable<any> {
    return this.http.post(`${this.server}Report/BranchRequests`, branchSelection);
  }

  // ------------ADMIN HOME GRAPH------------------
  getSales(branchID: any) {
    return this.http.get(environment.baseURI + 'Report/GetSales/' + branchID);
  }

  getPopularProducts(branchID: any) {
    return this.http.get(environment.baseURI + 'Report/GetPopularProducts/' + branchID);
  }

  frequencyInsight(branchSelection: StockReportParameters): Observable<any> {
    return this.http.post(`${this.server}Report/FrequencyInsight`, branchSelection);
  }

  writeOffHistory(branchSelection: StockReportParameters): Observable<any> {
    return this.http.post(`${this.server}Report/WriteOffHistory`, branchSelection);
  }
}