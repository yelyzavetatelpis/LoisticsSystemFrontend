// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login';
// import { RegisterComponent } from './components/register/register';
// import{DashboardComponent} from './components/dashboard/dashboard';
// import { LayoutComponent } from './components/layout/layout';
// import { AuthGuard } from './guards/auth.guard';
// export const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
 
 

//   { path: '', 
//   component: LayoutComponent,
// canActivate: [AuthGuard],
//   children:[{path: 'dashboard', component: DashboardComponent}] },
//   { path: '**', redirectTo: '/login' }
// ];
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout';
import { roleguard } from './guards/roleguard';
import { TripsComponent } from './components/trips/trips';
import { ShipmentsComponent } from './components/shipments/shipments';
import { OrdersComponent } from './components/orders/orders';
import { DashboardCustomerComponent } from './components/dashboardcustomer/dashboardcustomer';
import { DashboardDispatcherComponent } from './components/dashboarddispatcher/dashboarddispatcher';
import { DashboardDriverComponent } from './components/dashboarddriver/dashboarddriver';
import { DriverAvailabilityComponent } from './components/driveravailability/driveravailability';

export const routes: Routes = [

  //  PUBLIC ROUTES (NO LAYOUT)
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },

  //  PROTECTED ROUTES (WITH LAYOUT)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleguard],
        data: { roles: ['Admin'] }
      },

      {
        path: 'trips',
        component: TripsComponent,
        canActivate: [roleguard],
        data: { roles: ['Driver', 'Dispatcher', 'Admin'] }
      },

      {
        path: 'shipments',
        component: ShipmentsComponent,
        canActivate: [roleguard],
        data: { roles: ['Dispatcher', 'Admin'] }
      },

      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [roleguard],
        data: { roles: ['Customer'] }
      },

      {
        path: 'dashboardcustomer',
        component: DashboardCustomerComponent,
        canActivate: [roleguard],
        data: { roles: ['Customer'] }
      },
      {
        path: 'dashboarddispatcher',
        component: DashboardDispatcherComponent,
        canActivate: [roleguard],
        data: { roles: ['Dispatcher'] }
      },

      {
        path: 'dashboarddriver',
        component: DashboardDriverComponent,
        canActivate: [roleguard],
        data: { roles: ['Driver'] }
      },

      {path:'driveravailability',
      component: DriverAvailabilityComponent  ,
      canActivate: [roleguard],
      data: { roles: ['Driver'] }
      }
    

    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];