import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {


  firstName = localStorage.getItem('firstName') || 'Customer';
  today = new Date();


  pickupStreet = '';
  pickupCity = '';
  pickupPostalCode = '';
  deliveryStreet = '';
  deliveryCity = '';
  deliveryPostalCode = '';
  packageWeight: number = 0;
  price: number = 0;
  orderDescription = '';
  pickupDate = '';
  error = '';
  successMessage = '';


  orders: any[] = [];
  loadingOrders = false;


  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadOrders();
  }


  onSubmit(form: any): void {
    this.error = '';


    if (form.controls) {
      Object.values(form.controls).forEach((c: any) => c.markAsTouched());
    }


    if (form.invalid) {
      this.error = 'Please fill in all required fields.';
      return;
    }


    const orderData = {
      pickupStreet: this.pickupStreet,
      pickupCity: this.pickupCity,
      pickupPostalCode: this.pickupPostalCode,
      deliveryStreet: this.deliveryStreet,
      deliveryCity: this.deliveryCity,
      deliveryPostalCode: this.deliveryPostalCode,
      packageWeight: this.packageWeight,
      price: this.Price,
      orderDescription: this.orderDescription,
      pickupDate: this.pickupDate
    };


    this.orderService.createOrder(orderData).subscribe({
     next: (response: any) => {
  const orderId = response?.orderId || response?.id || '';
  form.resetForm();
  this.loadOrders();
  this.successMessage = `Order #${orderId} placed successfully!`;
  setTimeout(() => {
    this.successMessage = '';
    this.cdr.detectChanges();
  }, 3000);
},
    });
  }


  loadOrders(): void {
    this.loadingOrders = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loadingOrders = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingOrders = false;
      }
    });
  }


  get Price(): number {
    return this.packageWeight ? this.packageWeight * 5 : 0;
  }
}



