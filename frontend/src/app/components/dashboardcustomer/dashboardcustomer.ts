import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerDashboardService } from '../../services/customer-dashboard.service';


@Component({
  selector: 'app-dashboardcustomer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboardcustomer.component.html',
  styleUrls: ['./dashboardcustomer.component.css']
})
export class DashboardCustomerComponent implements OnInit {


  // dashboard data
  dashboardStats: any;
  recentOrders: any[] = [];
  recentDeliveredOrders: any[] = [];
  loading = false;
  error = '';


  // order tracking
  selectedOrder: any = null;
  trackingSteps: any[] = [];

  // greeting display
  timeOfDay = '';
  customerName = '';
  currentDate = '';

  constructor(
    private dashboardService: CustomerDashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // greeting based on current hour
    const hour = new Date().getHours();
    if (hour < 12) this.timeOfDay = 'Morning';
    else if (hour < 17) this.timeOfDay = 'Afternoon';
    else this.timeOfDay = 'Evening';

    // get the customers first name from the auth service
    this.authService.currentUser$.subscribe(user => {
      this.customerName = user?.username ?? '';
    });

    this.currentDate = new Date().toDateString();
    this.loadDashboard();
  }

  // fetch all dashboard data from the api
  loadDashboard(): void {
    this.loading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardStats = {
          totalOrders: res.totalOrders,
          pendingOrders: res.pendingOrders,
          inTransitOrders: res.inTransitOrders,
          deliveredOrders: res.deliveredOrders
        };
        this.recentOrders = res.recentOrders;
        this.recentDeliveredOrders = res.recentDeliveredOrders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }

  //tracking timeline based on the orders current status
  selectOrder(order: any): void {
    this.selectedOrder = order;
    const status = order.statusName;

    if (status === 'Cancelled') {
      this.trackingSteps = [
        { label: 'Order Placed', completed: true },
        { label: 'Cancelled', completed: true }
      ];
    } else if (status === 'Rejected') {
      this.trackingSteps = [
        { label: 'Order Placed', completed: true },
        { label: 'Rejected', completed: true }
      ];
    } else if (status === 'Picked Up') {
      this.trackingSteps = [
        { label: 'Order Placed', completed: true },
        { label: 'Picked Up', completed: true },
        { label: 'In Transit', completed: false },
        { label: 'Delivered', completed: false }
      ];
    } else if (status === 'Delivered') {
      this.trackingSteps = [
        { label: 'Order Placed', completed: true },
        { label: 'Picked Up', completed: true },
        { label: 'In Transit', completed: true },
        { label: 'Delivered', completed: true }
      ];
    } else {
      // order placed but not yet picked up
      this.trackingSteps = [
        { label: 'Order Placed', completed: true },
        { label: 'Picked Up', completed: false },
        { label: 'In Transit', completed: false },
        { label: 'Delivered', completed: false }
      ];
    }
  }
}


