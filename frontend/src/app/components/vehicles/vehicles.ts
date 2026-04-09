import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';


@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {


  vehicles: any[] = [];


  // form fields for adding a new vehicle
  registrationNumber = '';
  capacity: number | null = null;
  vehicleModel = '';
  vehicleAvailabilityStatusId = 1;


  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  constructor(
    private vehicleService: VehicleService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadVehicles();
  }


  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => { this.toastMessage = ''; }, 4000);
  }


  // fetch all vehicles from the api
  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (res: any) => {
        this.vehicles = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading vehicles', err)
    });
  }


  // submit a new vehicle and reset the form
  addVehicle(): void {
    const data = {
      registrationNumber: this.registrationNumber,
      capacity: this.capacity,
      vehicleModel: this.vehicleModel,
      vehicleAvailabilityStatusId: this.vehicleAvailabilityStatusId
    };


    this.vehicleService.addVehicle(data).subscribe({
      next: () => {
        this.showToast('Vehicle added successfully');
        this.registrationNumber = '';
        this.capacity = null;
        this.vehicleModel = '';
        this.vehicleAvailabilityStatusId = 1;
        this.loadVehicles();
        this.cdr.detectChanges();
      },
      error: (err) => this.showToast(err?.error || 'Failed to add vehicle', 'error')
    });
  }


 
  getStatusName(statusId: number): string {
    switch (statusId) {
      case 1: return 'Available';
      case 2: return 'In Use';
      case 3: return 'Under Maintenance';
      default: return 'Unknown';
    }
  }


  // update a vehicles availability status
  updateStatus(vehicle: any, newStatusId: number): void {
    if (vehicle.vehicleAvailabilityStatusId === newStatusId) return;


    this.vehicleService.updateVehicleStatus(vehicle.vehicleId, newStatusId).subscribe({
      next: () => {
        this.showToast('Status updated successfully');
        this.loadVehicles();
      },
      error: (err) => this.showToast(err?.error || 'Failed to update status', 'error')
    });
  }
}



