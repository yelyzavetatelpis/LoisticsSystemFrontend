import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) { }
  getDashboardMetrics() {
    debugger;
    return this.http.get<any>('https://localhost:7018/api/dashboard/metrics');
  }
}



