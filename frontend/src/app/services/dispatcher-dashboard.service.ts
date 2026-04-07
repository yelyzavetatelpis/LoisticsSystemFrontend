import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DispatcherDashboardService {
  private apiUrl = 'https://localhost:7018/api/dashboarddispatcher';


  constructor(private http: HttpClient) {}


  getDashboard() {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }


  // get trips planned for a specific date range
  getTripsByDate(from: string, to: string) {
    return this.http.get<any[]>(`${this.apiUrl}/trips?fromDate=${from}&toDate=${to}`);
  }
}



