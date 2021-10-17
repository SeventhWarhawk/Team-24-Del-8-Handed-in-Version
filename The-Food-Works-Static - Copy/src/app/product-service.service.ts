import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  server = 'https://localhost:44325/';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(`${this.server}Branch/GetAllMenuProducts`, this.httpOptions);
  }
}
