import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const API_BASE = 'http://localhost:5209/api';

@Injectable({
  providedIn: 'root'
})
export class DashboardCustomerService {
  private summaryUrl = `${API_BASE}/dashboard/customer/summary`;
  private ordersUrl = `${API_BASE}/dashboard/customer/myOrders`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(customerId?: number | null): Observable<any> {
    const url = customerId != null
      ? `${API_BASE}/dashboard/customer/${customerId}/summary`
      : this.summaryUrl;

    return this.http.get(url).pipe(
      map((res: any) => this.normalizeSummary(res))
    );
  }

  getActiveOrders(customerId?: number | null): Observable<any[]> {
    debugger;
    const url = customerId != null
      ? `${API_BASE}/myOrders/customer/${customerId}`
      : this.ordersUrl;

    return this.http.get(url).pipe(
      map((list: any) => Array.isArray(list) ? list : [])
    );
  }

  private normalizeSummary(res: any): any {
    return {
      totalOrders: res?.totalOrders ?? 0,
      ordersThisMonth: res?.ordersThisMonth ?? 0,
      inTransit: res?.inTransit ?? 0,
      delivered: res?.delivered ?? 0,
      pending: res?.pending ?? 0
    };
  }

  mapOrderToActiveOrder(order: any): any {
    const status = (order.status ?? order.statusName ?? 'PENDING').toUpperCase();
    const statusClass = this.getStatusClass(status);
    const destination = order.destination ?? order.deliveryAddress ?? order.deliveryStreet ?? '—';
    const items = order.items ?? (order.packageCount != null ? `${order.packageCount} package(s)` : '—');
    const eta = order.eta ?? order.estimatedDelivery ?? '—';

    let trackingSteps = order.trackingSteps ?? order.trackingEvents ?? [];
    const steps = trackingSteps.map((s: any) => ({
      label: s.label,
      time: s.time ?? null,
      completed: s.completed ?? false
    }));

    if (steps.length === 0) {
      steps.push(
        { label: 'Order Placed', time: null, completed: true },
        { label: 'Picked Up', time: null, completed: false },
        { label: 'In Transit', time: null, completed: false },
        { label: 'Out for Delivery', time: null, completed: false },
        { label: 'Delivered', time: null, completed: false }
      );
    }

    return {
      orderId: String(order.orderId),
      destination,
      items,
      status,
      statusClass,
      eta,
      trackingSteps: steps
    };
  }

  private getStatusClass(status: string): string {
    const s = status.toUpperCase();
    if (s.includes('TRANSIT')) return 'transit';
    if (s.includes('DISPATCH') || s.includes('SHIPPED')) return 'dispatched';
    if (s.includes('PENDING') || s.includes('PROCESSING')) return 'pending';
    if (s.includes('DELIVERED')) return 'delivered';
    return 'pending';
  }
}