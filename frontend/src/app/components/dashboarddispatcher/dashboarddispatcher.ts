import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DispatcherDashboardService } from '../../services/dispatcher-dashboard.service';


@Component({
  selector: 'app-dashboarddispatcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboarddispatcher.component.html',
  styleUrls: ['./dashboarddispatcher.component.css']
})
export class DashboardDispatcherComponent implements OnInit, OnDestroy {


  // greeting display
  timeOfDay = '';
  dispatcherName = '';
  currentDate = '';


  // data
  trips: any[] = [];
  dashboardStats: any = {
    totalOrders: 0,
    pendingOrders: 0,
    availableDriver: 0,
    availableVehicle: 0
  };


  // toast state
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  // auto-refresh subscription
  private refreshSub?: Subscription;


  constructor(
    private dispatcherService: DispatcherDashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.timeOfDay = this.computeTimeOfDay();
    this.currentDate = new Date().toDateString();


    // get dispatcher name from auth service
    this.authService.currentUser$.subscribe(user => {
      this.dispatcherName = user?.username ?? '';
    });


    this.loadDashboard();
    this.loadTodayTrips();


    // refresh both dashboard stats and today's trips every 4 seconds
    this.refreshSub = interval(4000).subscribe(() => {
      this.loadDashboard(true);
      this.loadTodayTrips(true);
    });
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


  // error message
  private getErrorMessage(err: any): string {
    if (err?.error?.errors) {
      const all = Object.values(err.error.errors).flat();
      if (all.length > 0) return all[0] as string;
    }
    if (typeof err?.error === 'string') return err.error;
    return err?.error?.message || err?.error?.title || 'Something went wrong';
  }


  //greeting based on current hour
  private computeTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }


  // get statisticas for the dispatcher dashboard
  loadDashboard(silent: boolean = false): void {
    this.dispatcherService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (!silent) this.showToast(this.getErrorMessage(err) || 'Failed to load dashboard', 'error');
      }
    });
  }


  // get trips planned for today
  loadTodayTrips(silent: boolean = false): void {
    const today = new Date().toISOString().split('T')[0];
    this.dispatcherService.getTripsByDate(today, today).subscribe({
      next: (res) => {
        this.trips = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (!silent) this.showToast(this.getErrorMessage(err) || 'Failed to load trips', 'error');
      }
    });
  }
}


