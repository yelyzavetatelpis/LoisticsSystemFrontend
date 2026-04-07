import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl   = 'https://localhost:7018/api/orders';
  private shipmentUrl = 'https://localhost:7018/api/shipment';
  private tripsUrl    = 'https://localhost:7018/api/trips';

  constructor(private http: HttpClient) {}

  // --- customer ---

  // submit a new order
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.ordersUrl}/createOrder`, orderData);
  }

  // get all orders placed by the logged in customer
  getMyOrders(): Observable<any> {
    return this.http.get(`${this.ordersUrl}/myOrders`);
  }

  // --- dispatcher ---

  // get orders waiting for review
  getPendingOrders(): Observable<any> {
    return this.http.get(`${this.shipmentUrl}/pending`);
  }

  // accept an order by id
  acceptOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.shipmentUrl}/${orderId}/accept`, {});
  }

  // reject an order with a reason
  rejectOrder(orderId: number, reason: string): Observable<any> {
    return this.http.post(`${this.shipmentUrl}/${orderId}/reject`, { reason });
  }

  // get shipments ready to be assigned to a trip
  getShipments(): Observable<any> {
    return this.http.get(`${this.shipmentUrl}/ready`);
  }

  // --- trips ---

  // get all trips
  getTrips() {
    return this.http.get(this.tripsUrl);
  }

  // get shipments assigned to a specific trip
  getTripShipments(tripId: number) {
    return this.http.get(`${this.tripsUrl}/${tripId}/shipments`);
  }

  // create a new trip
  createTrip(request: any) {
    return this.http.post(`${this.tripsUrl}/createTrip`, request);
  }

  // start a planned trip
  startTrip(tripId: number): Observable<any> {
    return this.http.patch(`${this.tripsUrl}/${tripId}/start`, {});
  }

  // get available drivers
  getAvailableDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.tripsUrl}/availableDrivers`);
  }

  // get drivers available on a specific date
  getAvailableDriversByDate(tripDate: string) {
    return this.http.get<any[]>(`${this.tripsUrl}/availableDriversByDate?tripDate=${tripDate}`);
  }

  // get available vehicles
  getAvailableVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.tripsUrl}/availableVehicles`);
  }

  // update a shipments status
  updateShipmentStatus(shipmentId: number, status: string): Observable<any> {
    return this.http.patch(
      `${this.tripsUrl}/shipments/${shipmentId}/status`,
      { status }
    );
  }
}



