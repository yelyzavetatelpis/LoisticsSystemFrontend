import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css']
})
export class ShipmentsComponent implements OnInit {

  shipments: any[] = [];
  drivers: any[] = [];
  driversByDate: any[] = [];
  vehicles: any[] = [];
  tripDate: any;

  selectedDriverId: number | null = null;
  selectedVehicleId: number | null = null;

  // toast notification state
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadShipments();
    this.loadDrivers();
    this.loadVehicles();
  }

  // toast message
  showToast(message: string, type: 'success' | 'error' = 'success'): void {
  this.toastMessage = message;
  this.toastType = type;
  this.cdr.detectChanges();
  setTimeout(() => {
    this.toastMessage = '';
    this.cdr.detectChanges();
  }, 3000);
}

  loadShipments(): void {
    this.orderService.getShipments().subscribe({
      next: (res: any) => {
        this.shipments = res;
        this.shipments.forEach((s: any) => s.selected = false);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadDrivers(): void {
    this.orderService.getAvailableDrivers().subscribe(res => {
      this.drivers = res;
      this.cdr.detectChanges();
    });
  }

  loadVehicles(): void {
    this.orderService.getAvailableVehicles().subscribe(res => {
      this.vehicles = res;
      this.cdr.detectChanges();
    });
  }

  // load drivers available on the selected trip date
  loadAvailableDriversByDate(): void {
    this.orderService.getAvailableDriversByDate(this.tripDate).subscribe({
      next: (res: any) => {
        this.driversByDate = res;
        this.driversByDate.forEach((s: any) => s.selected = false);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // create a trip with the chosen shipments
  createTrip(): void {
    const selectedShipments = this.shipments.filter((s: any) => s.selected);

    if (selectedShipments.length === 0) {
      this.showToast('Please select at least one shipment.', 'error');
      return;
    }

    if (!this.selectedDriverId || !this.selectedVehicleId) {
      this.showToast('Please select a driver and a vehicle.', 'error');
      return;
    }

    // check if total weight doesnt exceed vehicle capacity
    const selectedVehicle = this.vehicles.find((v: any) => v.vehicleId === this.selectedVehicleId);
    const vehicleCapacity = selectedVehicle?.capacity != null ? Number(selectedVehicle.capacity) : 0;
    const totalWeight = selectedShipments.reduce(
      (sum: number, s: any) => sum + (Number(s.order?.packageWeight ?? 0) || 0), 0);

    if (totalWeight > vehicleCapacity) {
      this.showToast(
        `Total weight (${totalWeight} kg) exceeds vehicle capacity (${vehicleCapacity} kg).`,
        'error'
      );
      return;
    }

    const request = {
      driverId: this.selectedDriverId,
      vehicleId: this.selectedVehicleId,
      shipmentIds: selectedShipments.map((s: any) => s.shipmentId)
    };

    this.orderService.createTrip(request).subscribe({
     next: () => {
  this.showToast('Trip created successfully!', 'success');
  this.selectedDriverId = null;
  this.selectedVehicleId = null;
  this.loadShipments();
  this.loadDrivers();
  this.loadVehicles();
  if (this.tripDate) this.loadAvailableDriversByDate();
},
      error: (err) => {
        console.error(err);
        this.showToast('Failed to create trip. Please try again.', 'error');
      }
    });
  }
}



