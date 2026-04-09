import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'https://localhost:7018/api/vehicles';


  constructor(private http: HttpClient) {}


  getVehicles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  addVehicle(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }


  updateVehicleStatus(vehicleId: number, statusId: number) {
    return this.http.put(`${this.apiUrl}/status`, {
      vehicleId,
      vehicleAvailabilityStatusId: statusId
    });
  }
}



