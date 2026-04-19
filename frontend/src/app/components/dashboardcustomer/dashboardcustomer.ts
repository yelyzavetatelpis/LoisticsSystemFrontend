import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CustomerDashboardService } from '../../services/customer-dashboard.service';


@Component({
  selector: 'app-dashboardcustomer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboardcustomer.component.html',
  styleUrls: ['./dashboardcustomer.component.css']
})
export class DashboardCustomerComponent implements OnInit, OnDestroy {


  // dashboard data
  dashboardStats: any;
  recentOrders: any[] = [];
  recentDeliveredOrders: any[] = [];
  loading = false;


  // order tracking
  selectedOrder: any = null;
  trackingSteps: any[] = [];


  // greeting display
  timeOfDay = '';
  customerName = '';
  currentDate = '';


  // toast state
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  // auto-refresh subscription
  private refreshSub?: Subscription;


  constructor(
    private dashboardService: CustomerDashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.timeOfDay = this.computeTimeOfDay();
    this.currentDate = new Date().toDateString();


    // get the customers first name from the auth service
    this.authService.currentUser$.subscribe(user => {
      this.customerName = user?.username ?? '';
    });


    this.loadDashboard();


    // refresh dashboard every 4 seconds
    this.refreshSub = interval(4000).subscribe(() => this.loadDashboard(true));
  }


  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }


  // helper for a toast
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }


  //error message
  private getErrorMessage(err: any): string {
    if (err?.error?.errors) {
      const all = Object.values(err.error.errors).flat();
      if (all.length > 0) return all[0] as string;
    }
    if (typeof err?.error === 'string') return err.error;
    return err?.error?.message || err?.error?.title || 'Something went wrong';
  }


  // greeting based on current hour
  private computeTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }


  // fetch all dashboard data from the api
  loadDashboard(silent: boolean = false): void {
    if (!silent) this.loading = true;


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


        if (this.selectedOrder) {
          const updated = this.recentOrders.find(o => o.orderId === this.selectedOrder.orderId)
                       ?? this.recentDeliveredOrders.find(o => o.orderId === this.selectedOrder.orderId);
          if (updated && updated.statusName !== this.selectedOrder.statusName) {
            this.selectOrder(updated);
          }
        }


        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        if (!silent) this.showToast(this.getErrorMessage(err) || 'Failed to load dashboard', 'error');
      }
    });
  }


  // tracking timeline based on the orders current status
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
    } else if (status === 'In Transit') {
      this.trackingSteps = [
        { label: 'Order Placed', completed: true },
        { label: 'Picked Up', completed: true },
        { label: 'In Transit', completed: true },
        { label: 'Delivered', completed: false }
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


