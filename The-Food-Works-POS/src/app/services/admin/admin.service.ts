import { WriteOff, SelectedProduct, BusinessRule } from './../../interfaces/admin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BranchProduct, Product, UserRole } from 'src/app/interfaces/admin';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Audit } from 'src/app/interfaces/audit';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  branchId: any;
  server = 'https://localhost:44325/';

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  auditHttpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    withCredentials: true,
    observe: 'response' as 'body',
  };

  constructor(private http: HttpClient) { }

  products: any[] = [];

  addUserRole(userRole: UserRole) {
    return this.http.post<UserRole>(`${this.server}Admin/AddUserRole`, userRole, this.auditHttpOptions);
  }
  updateUserRole(userRole: UserRole) {
    return this.http.post<UserRole>(`${this.server}Admin/UpdateUserRole`, userRole, this.auditHttpOptions);
  }

  getAllUserRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.server}Admin/getAllUserRoles`, this.httpOptions);

  }

  findUserRole(Shared: number): Observable<UserRole> {
    // tslint:disable-next-line:object-literal-key-quotes
    const JSONObjectToSend = { 'ID': Shared };
    return this.http.post<UserRole>(`${this.server}Admin/FindUserRole`, JSONObjectToSend, this.httpOptions);
  }

  findProduct(p: SelectedProduct[]) {
    return this.http.post<any>(`${this.server}Admin/FindProduct`, p, this.httpOptions);
  }

  // read ALL products
  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.server}Admin/GetAllBranchProducts`, this.httpOptions);
  }

  ValidateWO(item: WriteOff) {
    return this.http.post<any>(`${this.server}Admin/ValidateWO`, item, this.httpOptions);
  }

  WriteOff(item: WriteOff[]) {
    return this.http.post<WriteOff[]>(`${this.server}Admin/FinalWriteOff`, item, this.auditHttpOptions);
  }

  getAudits(): Observable<Audit> {
    return this.http.get<Audit>(`${this.server}Admin/GetAllAudits`, this.httpOptions);
  }

  getAuditsToday(): Observable<Audit> {
    return this.http.get<Audit>(`${this.server}Admin/GetAuditsToday`);
  }

  deleteType(vm: number) {
    const JSONObjectToSend = { 'ID': vm };
    return this.http.post<number>(`${this.server}Admin/DeleteRole`, JSONObjectToSend, this.auditHttpOptions);
  }

  // backup(body: any) {
  //   return https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Sql/servers/{serverName}/databases/{databaseName}?api-version=2021-02-01-preview
  // }

  adjustBusinessRules(obj: BusinessRule) {
    return this.http.post(`${this.server}Admin/AdjustBusinessRules`, obj);
  }

  backup(obj: any) {
    const JSONObjectToSend = { 'fileName': obj.name };
    return this.http.post(`${this.server}Backup/Backup`, JSONObjectToSend, this.httpOptions);
  }

}
