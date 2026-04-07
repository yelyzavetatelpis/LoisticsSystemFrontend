import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DispatcherDashboardService } from '../../services/dispatcher-dashboard.service';


@Component({
  selector: 'app-dashboarddispatcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboarddispatcher.component.html',
  styleUrls: ['./dashboarddispatcher.component.css']
})
export class DashboardDispatcherComponent implements OnInit {


  timeOfDay = '';
  customerName = '';
  currentDate = '';
  trips: any[] = [];


  dashboardStats: any = {
    totalOrders: 0,
    pendingOrders: 0,
    availableDriver: 0,
    availableVehicle: 0
  };


  constructor(
    private dispatcherService: DispatcherDashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    //  greeting based on the current hour
    const hour = new Date().getHours();
    if (hour < 12) this.timeOfDay = 'Morning';
    else if (hour < 17) this.timeOfDay = 'Afternoon';
    else this.timeOfDay = 'Evening';


    
    this.authService.currentUser$.subscribe(user => {
      this.customerName = user?.username ?? '';
    });


    this.currentDate = new Date().toDateString();
    this.loadDashboard();
    this.loadTodayTrips();
  }


  // get statisticas for the dispatcher dashboard
  loadDashboard(): void {
    this.dispatcherService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }


  // get trips planned for today
  loadTodayTrips(): void {
    const today = new Date().toISOString().split('T')[0];
    this.dispatcherService.getTripsByDate(today, today).subscribe({
      next: (res) => {
        this.trips = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}



