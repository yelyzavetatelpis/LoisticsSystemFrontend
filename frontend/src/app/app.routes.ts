import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { LayoutComponent } from './components/layout/layout';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/roleguard';
import { DashboardCustomerComponent } from './components/dashboardcustomer/dashboardcustomer';
import { DashboardDispatcherComponent } from './components/dashboarddispatcher/dashboarddispatcher';
import { DashboardDriverComponent } from './components/dashboarddriver/dashboarddriver';
import { OrdersComponent } from './components/orders/orders';
import { PendingOrdersComponent } from './components/pendingorders/pendingorders';
import { ShipmentsComponent } from './components/shipments/shipments';
import { TripsComponent } from './components/trips/trips';
import { DriverAvailabilityComponent } from './components/driveravailability/driveravailability';

export const routes: Routes = [

  // Public routes 
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },

  // Protected routes 
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboardcustomer',
        component: DashboardCustomerComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Customer'] }
      },
      {
        path: 'dashboarddispatcher',
        component: DashboardDispatcherComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Dispatcher'] }
      },
      {
        path: 'dashboarddriver',
        component: DashboardDriverComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Driver'] }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Customer'] }
      },
      {
        path: 'pendingorders',
        component: PendingOrdersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Dispatcher'] }
      },
      {
        path: 'shipments',
        component: ShipmentsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Dispatcher', 'Admin'] }
      },
      {
        path: 'trips',
        component: TripsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Driver', 'Dispatcher', 'Admin'] }
      },
      {
        path: 'driveravailability',
        component: DriverAvailabilityComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Driver'] }
      }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];