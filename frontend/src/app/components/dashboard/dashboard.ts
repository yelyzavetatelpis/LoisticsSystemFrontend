import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Dashboard statistics TEST data
  kpis = {
    totalOrders: 156,
    activeShipments: 23,
    totalDrivers: 12,
    activeTrips: 8,
    totalCustomers: 45,
    pendingOrders: 15,
    completedShipments: 133,
    availableVehicles: 7
  };

  // Recent orders TEST data
  recentOrders = [
    { orderId: 1001, customerName: 'John Smith', statusName: 'Processing', createdAt: new Date('2024-02-10') },
    { orderId: 1002, customerName: 'Maria Garcia', statusName: 'Shipped', createdAt: new Date('2024-02-11') },
    { orderId: 1003, customerName: 'Peter Johnson', statusName: 'Pending', createdAt: new Date('2024-02-12') },
    { orderId: 1004, customerName: 'Anna Williams', statusName: 'Delivered', createdAt: new Date('2024-02-13') }
  ];

  ngOnInit(): void {
    
  }

  viewAllOrders(): void {
    console.log('View all orders clicked');
  }
}