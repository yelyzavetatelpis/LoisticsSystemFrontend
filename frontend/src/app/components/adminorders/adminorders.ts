import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrdersService } from '../../services/adminorder.service';


@Component({
  selector: 'app-adminorders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminorders.component.html',
  styleUrls: ['./adminorders.component.css']
})
export class AdminOrdersComponent implements OnInit {


  orders: any[] = [];
  loadingOrders = false;


  // filter fields
  filterEmail = '';
  fromDate = '';
  toDate = '';


  constructor(
    private adminOrdersService: AdminOrdersService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadOrders();
  }


  // all orders
  loadOrders(): void {
    this.loadingOrders = true;
    this.adminOrdersService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.loadingOrders = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingOrders = false;
        console.error('Error loading orders', err);
      }
    });
  }


  // email and date filters
  applyFilter(): void {
    const filterData = {
      email: this.filterEmail || null,
      fromDate: this.fromDate ? new Date(this.fromDate) : null,
      toDate: this.toDate ? new Date(this.toDate) : null
    };


    this.adminOrdersService.getFilteredOrders(filterData).subscribe({
      next: (res: any) => {
        this.orders = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }


  resetFilter(): void {
    this.filterEmail = '';
    this.fromDate = '';
    this.toDate = '';
    this.loadOrders();
  }
}



