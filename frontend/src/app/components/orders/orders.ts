import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  
  customerId: number | null = null;
  pickupStreet = '';
  pickupCity = '';
  pickupPostalCode = '';
  deliveryStreet = '';
  deliveryCity = '';
  deliveryPostalCode = '';
  packageWeight = '';
  orderdescription = '';
  pickupDate = '';
  error='';
  successMessage = '';
  isSubmitted = false;

  constructor(private orderService: OrderService, private router: Router) { }
  onSubmit(): void {
    debugger;
    this.isSubmitted = true;
    if (this.orderdescription && this.pickupStreet && this.pickupCity && this.pickupPostalCode && this.deliveryStreet && this.deliveryCity && this.deliveryPostalCode && this.packageWeight && this.pickupDate) {
      const orderData = {
        customerId: this.customerId,
        pickupStreet: this.pickupStreet,
        pickupCity: this.pickupCity,
        pickupPostalCode: this.pickupPostalCode,
        deliveryStreet: this.deliveryStreet,
        deliveryCity: this.deliveryCity,
        deliveryPostalCode: this.deliveryPostalCode,
        packageWeight: this.packageWeight,
        orderdescription: this.orderdescription,
        pickupDate: this.pickupDate
      };
      console.log('Submitting order data:', orderData);
      // this.orderService.createOrder(orderData).subscribe({
      //   next: (response) => {
      //     console.log('Order created successfully:', response);
      //     this.successMessage = 'Order created successfully!';
      //     setTimeout(() => {
      //       this.router.navigate(['/orders']);
      //     }, 2000);
      //   },
      //   error: (error) => {
      //     console.error('Error creating order:', error);
      //     this.error = 'Error creating order. Please try again.';
      //   }
      // });
    // } else {
    //   this.error = 'Please fill in all required fields.';
}
  }
  ngOnInit(): void {
    
  }
}