import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardCustomerService } from '../../services/dashboardcustomer.service';

export interface TrackingStep {
  label: string;
  time?: string | null;
  completed: boolean;
}

export interface ActiveOrder {
  orderId: string;
  destination: string;
  items: string;
  status: string;
  statusClass: string;
  eta: string;
  trackingSteps: TrackingStep[];
}

@Component({
  selector: 'app-dashboardcustomer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboardcustomer.component.html',
  styleUrls: ['./dashboardcustomer.component.css']
})
export class DashboardCustomerComponent implements OnInit {
  customerName = 'Maria';
  location = 'Blagoevgrad';
  currentDate = '';
  timeOfDay = 'morning';

  summary = {
    totalOrders: 0,
    ordersThisMonth: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0
  };

  
  activeOrders: ActiveOrder[] = [];
  loading=true;
  error: string | null = null;
  selectedOrder: any = null;

  constructor(
    private dashboardService: DashboardCustomerService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.setTimeOfDay();
    const user = this.auth.getCurrentUser();
    if (user?.firstName) {
      this.customerName = user.firstName;
    }
    const customerId = this.auth.getCurrentUserId();
    this.loadActiveOrders(customerId);
  }
private loadActiveOrders(customerId: number | null): void {
    this.loading = true;
    this.error = null;
debugger;
    this.dashboardService.getActiveOrders(customerId).subscribe({
      next: (orders) => {
        this.activeOrders = orders.map((o) =>
          this.dashboardService.mapOrderToActiveOrder(o)
        );
        this.selectedOrder = this.activeOrders.length > 0 ? this.activeOrders[0] : null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load orders.';
        console.error('Active orders error:', err);
      }
    });
  }
  private setCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  private setTimeOfDay(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.timeOfDay = 'morning';
    else if (hour < 18) this.timeOfDay = 'afternoon';
    else this.timeOfDay = 'evening';
  }

  selectOrder(order: any): void {
    this.selectedOrder = order;
  }

  goToOrderDetails(order: any): void {
    this.router.navigate(['/orders'], { queryParams: { orderId: order.orderId } });
  }
}