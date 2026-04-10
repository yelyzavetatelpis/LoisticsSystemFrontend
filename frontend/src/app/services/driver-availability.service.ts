import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface DriverAvailabilityDays {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
}


export interface DriverAvailabilityResponse {
  isAvailable: boolean;
  availableDays: DriverAvailabilityDays;
}


export interface SaveDriverAvailabilityRequest {
  isAvailable: boolean;
  availableDays: DriverAvailabilityDays;
}


@Injectable({
  providedIn: 'root'
})
export class DriverAvailabilityService {
  private apiUrl = 'https://localhost:7018/api/driveravailability';


  constructor(private http: HttpClient) {}


  // get the drivers current availability
  getMyAvailability(): Observable<DriverAvailabilityResponse> {
    return this.http.get<DriverAvailabilityResponse>(this.apiUrl);
  }


  // save or update the drivers weekly availability
  saveMyAvailability(payload: SaveDriverAvailabilityRequest): Observable<DriverAvailabilityResponse> {
    return this.http.put<DriverAvailabilityResponse>(this.apiUrl, payload);
  }
}



