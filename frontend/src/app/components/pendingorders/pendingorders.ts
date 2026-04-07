import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-pendingorder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pendingorders.component.html',
  styleUrls: ['./pendingorders.component.css']
})
export class PendingOrdersComponent implements OnInit {


  orders: any[] = [];
  successMessage = '';

  showRejectModal = false;
  selectedOrderId: number | null = null;
  rejectionReason = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getPendingOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }


  acceptOrder(id: number): void {
    this.orderService.acceptOrder(id).subscribe({
      next: () => {
        this.loadOrders();
        this.successMessage = `Order #${id} accepted successfully!`;
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => console.error(err)
    });
  }

  openRejectModal(id: number): void {
    this.selectedOrderId = id;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedOrderId = null;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.rejectionReason.trim()) return;

    this.orderService.rejectOrder(this.selectedOrderId!, this.rejectionReason).subscribe({
      next: () => {
        const rejectedId = this.selectedOrderId;
        this.closeRejectModal();
        this.loadOrders();
        this.successMessage = `Order #${rejectedId} rejected.`;
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => console.error(err)
    });
  }
}



