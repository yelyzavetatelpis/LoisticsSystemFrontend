import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private apiUrl = 'https://localhost:7018/api/adminorders';


  constructor(private http: HttpClient) {}


  getAllOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  getFilteredOrders(filter: any) {
    return this.http.post(`${this.apiUrl}/filter`, filter);
  }
}



