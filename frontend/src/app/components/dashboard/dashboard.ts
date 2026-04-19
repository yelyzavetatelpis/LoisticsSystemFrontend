import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import Chart from 'chart.js/auto';
import { DashboardService } from '../../services/dashboard.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {


  // dashboard data
  data: any;
  metrics: any[] = [];
  metricGroups: any[] = [];


  // greeting
  timeOfDay = '';
  adminName = '';
  currentDate = '';


  // date filter
  startDate = '';
  endDate = '';


  // toast state
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  // auto-refresh subscription
  private refreshSub?: Subscription;


  // snapshot of last chart data
  private lastChartsData: string = '';


  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.timeOfDay = this.computeTimeOfDay();
    this.currentDate = new Date().toDateString();


    // get admin name from auth service
    this.authService.currentUser$.subscribe(user => {
      this.adminName = user?.username ?? '';
    });


    this.loadDashboard();


    // refresh dashboard every 4 seconds, but only in unfiltered mode
    this.refreshSub = interval(4000).subscribe(() => {
      if (!this.isFilterActive) {
        this.loadDashboard(true);
      }
    });
  }


  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }


  // true when admin has applied both start and end dates
  get isFilterActive(): boolean {
    return !!(this.startDate && this.endDate);
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


  // greeting based on current hour
  private computeTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }


  loadDashboard(silent: boolean = false): void {
  const start = this.startDate || undefined;
  const end = this.endDate || undefined;


  // capture filter state at the moment of request to avoid race with reset
  const requestIsFiltered = !!(start && end);


  this.dashboardService.getDashboardMetrics(start, end).subscribe({
    next: (res) => {
      // if by the time the response comes back the user has cleared/changed the filter,
      // ignore this stale response so we dont render old data in the wrong mode
      if (requestIsFiltered !== this.isFilterActive) {
        return;
      }


      this.data = res;
      const filtered = requestIsFiltered;


      // build metrics based on whether a filter is active
      this.metrics = [];


      // financial metrics
      this.metrics.push({
        category: 'Financial',
        metric: filtered ? 'Revenue in Selected Range' : 'Total Revenue',
        value: res.financial?.totalRevenue ?? 0
      });
      if (!filtered) {
        this.metrics.push(
          { category: 'Financial', metric: 'Revenue This Month', value: res.financial?.revenueThisMonth ?? 0 },
          { category: 'Financial', metric: 'Revenue This Week', value: res.financial?.revenueThisWeek ?? 0 }
        );
      }
      this.metrics.push({
        category: 'Financial',
        metric: filtered ? 'Avg Order Value in Range' : 'Average Order Value',
        value: res.financial?.averageOrderValue ?? 0
      });


      // orders metrics
      this.metrics.push({
        category: 'Orders',
        metric: filtered ? 'Orders in Selected Range' : 'Total Orders',
        value: res.orders?.totalOrders ?? 0
      });
      if (!filtered) {
        this.metrics.push(
          { category: 'Orders', metric: 'Orders This Month', value: res.orders?.ordersThisMonth ?? 0 },
          { category: 'Orders', metric: 'Orders This Week', value: res.orders?.ordersThisWeek ?? 0 }
        );
      }


      // users metrics always show system totals
      this.metrics.push(
        { category: 'Users', metric: 'Total Customers', value: res.users?.totalCustomers ?? 0 },
        { category: 'Users', metric: 'Total Drivers', value: res.users?.totalDrivers ?? 0 },
        { category: 'Users', metric: 'Total Dispatchers', value: res.users?.totalDispatchers ?? 0 }
      );


      // operations metrics always show system totals
      this.metrics.push(
        { category: 'Operations', metric: 'Total Shipments', value: res.operations?.totalShipments ?? 0 },
        { category: 'Operations', metric: 'Total Trips', value: res.operations?.totalTrips ?? 0 },
        { category: 'Operations', metric: 'Active Trips', value: res.operations?.activeTrips ?? 0 },
        { category: 'Operations', metric: 'Completed Trips', value: res.operations?.completedTrips ?? 0 }
      );


      // group metrics by category for the kpi table
      this.metricGroups = [];
      const grouped = new Map<string, any[]>();
      for (const m of this.metrics) {
        if (!grouped.has(m.category)) grouped.set(m.category, []);
        grouped.get(m.category)!.push(m);
      }
      grouped.forEach((items, category) => {
        this.metricGroups.push({ category, items });
      });


      this.cdr.detectChanges();
      setTimeout(() => this.loadCharts(), 100);
    },
    error: (err) => {
      if (!silent) this.showToast(this.getErrorMessage(err) || 'Failed to load dashboard', 'error');
    }
  });
}


  // apply date filter
  applyFilter(): void {
    this.loadDashboard();
  }


  // clear date filter  
  resetFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.loadDashboard();
  }


  // charts


  // only rebuild charts if the underlying data has actually changed
  loadCharts(): void {
    const snapshot = JSON.stringify({
      status: this.data?.orders?.adminOrdersByStatus,
      weekly: this.data?.financial?.weeklyRevenue,
      weeklyLabels: this.data?.financial?.weeklyRevenueLabels,
      growth: this.data?.orders?.orderGrowth,
      growthLabels: this.data?.orders?.orderGrowthLabels
    });


    if (snapshot === this.lastChartsData) return;
    this.lastChartsData = snapshot;


    this.createPieChart();
    this.createBarChart();
    this.createLineChart();
  }


  // pie chart showing order status breakdown
  createPieChart(): void {
    const ctx = document.getElementById('ordersPieChart') as HTMLCanvasElement;
    if (!ctx) return;


    Chart.getChart(ctx)?.destroy();


    const status = this.data.orders?.adminOrdersByStatus;


    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'In Progress', 'Delivered', 'Cancelled/Rejected'],
        datasets: [{
          data: [
            status?.pending ?? 0,
            status?.inTransit ?? 0,
            status?.delivered ?? 0,
            status?.cancelled ?? 0
          ],
          backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c']
        }]
      }
    });
  }


  // bar chart showing revenue buckets
  createBarChart(): void {
    const ctx = document.getElementById('revenueBarChart') as HTMLCanvasElement;
    if (!ctx) return;


    Chart.getChart(ctx)?.destroy();


    const weekly = this.data.financial?.weeklyRevenue ?? [0, 0, 0, 0];
    const labels = this.data.financial?.weeklyRevenueLabels ?? ['Week 1', 'Week 2', 'Week 3', 'Week 4'];


    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data: weekly,
          backgroundColor: '#e74c3c'
        }]
      }
    });
  }


  // line chart showing order count buckets
  createLineChart(): void {
    const ctx = document.getElementById('ordersLineChart') as HTMLCanvasElement;
    if (!ctx) return;


    Chart.getChart(ctx)?.destroy();


    const growth = this.data.orders?.orderGrowth ?? [0, 0, 0, 0];
    const labels = this.data.orders?.orderGrowthLabels ?? ['Week 1', 'Week 2', 'Week 3', 'Week 4'];


    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Orders Placed',
          data: growth,
          borderColor: '#2ecc71',
          fill: false
        }]
      }
    });
  }


  // export full kpi table as a pdf report
  exportPdf(): void {
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();


    // header
    pdf.setFontSize(16);
    pdf.text('BLogistics Dashboard Report', 14, 10);


    pdf.setFontSize(10);
    pdf.text(`Generated by: ${this.adminName}`, 14, 16);
    pdf.text(`Date: ${this.currentDate}`, pageWidth - 60, 16);


    // show date range if filtered
    if (this.startDate || this.endDate) {
      const range = `Filtered: ${this.startDate || 'All'} to ${this.endDate || 'All'}`;
      pdf.text(range, 14, 22);
    }


    // push table down if the filter range was applied
    const startY = this.startDate || this.endDate ? 30 : 25;


    const body = this.metrics.map(m => [
      m.category,
      m.metric,
      m.value?.toLocaleString()
    ]);


    autoTable(pdf, {
      head: [['Category', 'Metric', 'Value']],
      body: body,
      startY: startY,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [41, 128, 185]
      },
      didDrawPage: () => {
        const pageCount = pdf.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(`Page ${pageCount}`, pageWidth - 30, 200);
      }
    });


    pdf.save('BLogistics-kpis.pdf');
  }
}


