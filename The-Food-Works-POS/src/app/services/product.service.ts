import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductStatuses, ProductTypes, Current } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  server = 'https://localhost:44325/';

  //SaleId : number;
  Shared: number;

  setShared(data: number) {
    this.Shared = data
  }

  getShared() {
    return this.Shared;
  }


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



  //search products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetProducts`, this.httpOptions);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetAllProducts`, this.httpOptions);
  }


  getIngredients(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetIngredients`, this.httpOptions);
  }

  getPackages(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetPackages`, this.httpOptions);
  }

  getDesserts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetDesserts`, this.httpOptions);
  }

  getSides(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetSides`, this.httpOptions);
  }
  //get product types dropdown
  getproductTypes(): Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(`${this.server}Product/GetTypes`, this.httpOptions);
  }

  //get product types dropdown
  getproductStatuses(): Observable<ProductStatuses[]> {
    return this.http.get<ProductStatuses[]>(`${this.server}Product/GetStatuses`, this.httpOptions);
  }

  addProduct(contents: Product): Observable<any> {
    console.log(contents);
    return this.http.post<any>(this.server + 'Product/AddProduct', contents, this.auditHttpOptions)
  }

  //get one product
  getOneProduct(Name: string): Observable<any> {
    var JSONObjectToSend = { "ProductName": Name };
    console.log("Testing service: " + Name);
    return this.http.post<any>(`${this.server}Product/GetOneProduct`, JSONObjectToSend, this.httpOptions);
  }


  getCurrentIngredients(ID: any): Observable<Current[]> {
    var JSONObjectToSend = { "ProductId": ID };
    return this.http.post<Current[]>(`${this.server}Product/GetCurrentIngredients`, JSONObjectToSend, this.httpOptions);
  }


  getCurrentProducts(ID: any): Observable<Current[]> {
    var JSONObjectToSend = { "ProductId": ID };
    return this.http.post<Current[]>(`${this.server}Product/GetCurrentProducts`, JSONObjectToSend, this.httpOptions);
  }

  //update product
  updateProduct(product: Product) {
    return this.http.put(`${this.server}Product/UpdateProduct`, product, this.auditHttpOptions);
  }
  // ----------------------- CRUD PRODUCT TYPE -------------------------------
  addProductType(userRole: ProductTypes) {
    const JSONObjectToSend = { 'name': userRole.ProductTypeName };
    return this.http.post<ProductTypes>(`${this.server}Admin/AddProductType`, JSONObjectToSend, this.auditHttpOptions);
  }
  updateProductType(userRole: ProductTypes) {
    return this.http.post<ProductTypes>(`${this.server}Admin/UpdateProductType`, userRole, this.auditHttpOptions);
  }

  getAllProductTypes(): Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(`${this.server}Admin/getAllProductTypes`);

  }

  findProductType(Shared: number): Observable<ProductTypes> {
    const JSONObjectToSend = { 'ID': Shared };
    return this.http.post<ProductTypes>(`${this.server}Admin/FindProductType`, JSONObjectToSend, this.httpOptions);
  }

  deleteType(vm: number) {
    const JSONObjectToSend = { 'ID': vm };
    return this.http.post<number>(`${this.server}Admin/DeleteType`, JSONObjectToSend, this.auditHttpOptions);
  }
  deleteProduct(vm: number) {
    const JSONObjectToSend = { 'ProductId': vm };
    return this.http.post<number>(`${this.server}Product/DeleteProduct`, JSONObjectToSend, this.auditHttpOptions);
  }
}

