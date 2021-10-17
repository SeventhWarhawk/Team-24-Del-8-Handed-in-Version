import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

// Imported Interfaces
import { Branch, BranchProduct, BranchProductAssign, BranchProductUpdate } from '../interfaces/branch';
import { BranchRequestProducts } from './../interfaces/branch-request-products';
import { BranchCombined } from '../interfaces/branch-combined';
import { id } from '@swimlane/ngx-charts';


@Injectable({
  providedIn: 'root'
})
export class BranchService {

  // Data member for firebase image storage
  imageDetailList: AngularFireList<any>;

  constructor(private http: HttpClient, private firebase: AngularFireDatabase) { }

  // Base URL for API
  server = 'https://localhost:44325/';

  // Header options
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };
  //audit
  auditHttpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    withCredentials: true,
    observe: 'response' as 'body',
  };

  // Connecting to "CreateBranch" endpoint
  // Create a new branch
  createBranch(branch: BranchCombined): Observable<BranchCombined> {
    return this.http.post<BranchCombined>(this.server + 'Branch/CreateBranch', branch, this.httpOptions);
  }


  // ---

  // Connect to "UpdateBranch" endpoint
  // Used to update the selected branch
  updateBranch(newBranch: any, branchId: any) {
    console.log(newBranch);
    console.log(branchId);
    return this.http.post(this.server + 'Branch/UpdateBranch/' + branchId, newBranch, this.httpOptions);
  }


  // ---

  // Connecting to "GetBranchRequestProducts" endpoint
  // This endpoint is used to fetch all of the products that are to be a part of the new request
  getSuggestedProducts(branchId: any) {
    return this.http.post(this.server + 'Branch/GetSuggestedProducts', branchId)
  }


  // ---

  // Connecting to "GetBranchStock" endpoint
  // This endpoint is used to fetch all of the stock currently held by the branch at any given time
  getBranchStock(branchId: any) {
    return this.http.post(this.server + 'Branch/GetBranchStock', branchId);
  }


  // ---

  // Connecting to "GetBranchData" endpoint
  // This endpoint is used to fetch all of the branches that currently exist on the system at any given time
  getBranchData(): Observable<Branch> {
    return this.http.get<Branch>(this.server + 'Branch/GetBranchData', this.httpOptions);
  }


  // ---

  // Connecting to "GetAllBranchData" endpoint
  // This endpoint is used to fetch all of the information (details and address) related to a branch selected
  getAllBranchData(branchId: any) {
    return this.http.get(this.server + 'Branch/GetAllBranchData/' + branchId);
  }


  // ---

  getBranchId(): Observable<any> {
    const branchId = JSON.parse(localStorage['branch']);
    return of(branchId);
  }


  // ---

  // Branch Image Storage Service
  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  insertImageDetails(imageDetails: any) {
    this.imageDetailList.push(imageDetails);
  }


  // ---

  // Get All Product Type Names
  getProductTypes() {
    return this.http.get(this.server + 'Branch/GetProductTypes', this.httpOptions)
  }


  // ---

  // Connect to "GetProduct" endpoint
  // Used to populate the autocomplete suggestions for when adding a product (using modal)
  getProductNames(branchId: any) {
    return this.http.get<any>(this.server + 'Branch/GetProducts/' + branchId, this.httpOptions)
      .pipe(
        map((response: []) => response.map(item => item['ProductName']))
      )
  }


  // ---

  // Connect to "GetRequestProducts" endpoint
  // Used to populate the autocomplete suggestions for when adding a product to a new request (using modal)
  getProductRequestNames(branchId: any) {
    return this.http.get<any>(this.server + 'Branch/GetRequestProducts/' + branchId, this.httpOptions)
      .pipe(
        map((response: []) => response.map(item => item['ProductName']))
      )
  }


  // ---

  // Connect to "GetProductsByName" endpoint
  // Used to fetch specific product information using a passed product name
  getProductByName(productName: string): Observable<BranchProduct> {
    console.log(productName);
    return this.http.get<BranchProduct>(this.server + 'Branch/GetProductsByName/' + productName);
  }


  // ---

  // Connect to "UpdateBranchProductQuantity" endpoint
  // Used to update the branch products' quantity on hand after completing a branch stock take
  updateBranchProductQuantity(newQuantity: BranchProduct[], id: any): Observable<BranchProduct[]> {
    console.log(newQuantity)
    return this.http.post<BranchProduct[]>(this.server + 'Branch/UpdateBranchProductQuantity/' + id, newQuantity).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }


  // ---

  // Connect to "RequestBranchStock" endpoint
  // Used to send a new branch stock request and send an email to the factory store
  requestBranchStock(newRequest: BranchProduct[], id: any) {
    return this.http.post<BranchProduct[]>(this.server + 'Branch/RequestBranchStock/' + id, newRequest, { observe: 'response', withCredentials: true });
  }


  // ---

  // Connect to "GetRequests" endpoint
  // Used to get all of the requests currently on the system
  getRequests(branchId: any) {
    return this.http.get(this.server + 'Branch/GetRequests/' + branchId, this.httpOptions);
  }


  // ---

  // Connect to "GetRequestList" endpoint
  // Used to get all of the products in the request received
  getRequestList(requestId: any) {
    console.log(requestId)
    return this.http.get(this.server + 'Branch/GetRequestList/' + requestId, this.httpOptions);
  }


  // ---

  // Connect to "UpdateRequestQuantity" endpoint
  // Used to update the branches quantity on hand with the new request received
  updateRequestQuantity(newQuantity: BranchProduct[], branchId: any, requestId: any) {
    console.log(newQuantity);
    console.log(branchId);
    console.log(requestId);
    return this.http.post<BranchProduct[]>(this.server + 'Branch/UpdateRequestQuantity/' + branchId + '/' + requestId, newQuantity)
  }

  // -- DELETE BRANCH
  deleteBranch(vm: number) {
    const JSONObjectToSend = { 'ID': vm };
    return this.http.post<number>(`${this.server}Branch/DeleteBranch`, JSONObjectToSend, this.httpOptions);
  }

  // ----- GET BRANCH NAME -------
  getBranchName(branchId: number) {
    return this.http.get(this.server + 'Branch/GetBranchName/' + branchId);
  }

  //-------MAINTAIN BRANCH STOCK: EDIT PRICE AND BASELINE----------------
  findProduct(p: number, b: number) {
    const JSONObjectToSend = { 'ProductId': p, 'BranchId': b };
    return this.http.post<any>(`${this.server}Branch/FindProduct`, JSONObjectToSend, this.httpOptions);
  }

  updateBranchProduct(bp: BranchProductUpdate) {
    return this.http.post<BranchProductUpdate>(`${this.server}Branch/UpdateBP`, bp, this.httpOptions);
  }

  //-------Get Products to Assign----------------

  getProductsToAssign() {
    return this.http.get<any>(`${this.server}Branch/GetProductsToAssign`, this.httpOptions);
  }

  assignProducts(productToAssign: BranchProductAssign[]) {
    console.log("this is the product list being sent ", productToAssign)
    return this.http.post<any>(`${this.server}Branch/WriteProductsAssign`, productToAssign, this.httpOptions);
  }

}



