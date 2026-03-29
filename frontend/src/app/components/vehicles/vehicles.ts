import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicles.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {


  vehicles: any[] = [];


  registrationNumber = '';
  capacity: number | null = null;
  vehicleModel = '';
  vehicleAvailabilityStatusId = 1;


  constructor(private vehicleService: VehicleService, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.loadVehicles();
  }


  loadVehicles() {
    debugger;
    this.vehicleService.getVehicles().subscribe({
      next: (res: any) => {
        this.vehicles = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading vehicles', err);
      }
    });
  }


  addVehicle() {
    const data = {
      registrationNumber: this.registrationNumber,
      capacity: this.capacity,
      vehicleModel: this.vehicleModel,
      vehicleAvailabilityStatusId: this.vehicleAvailabilityStatusId
    };


    this.vehicleService.addVehicle(data).subscribe({
      next: () => {
        alert('Vehicle added successfully');
        this.loadVehicles();
       


        // reset form
        this.registrationNumber = '';
        this.capacity = null;
        this.vehicleModel = '';
        this.vehicleAvailabilityStatusId = 1;
         this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err?.error || 'Failed to add vehicle');
      }
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


  updateStatus(vehicle: any, newStatusId: number) {


  if (vehicle.vehicleAvailabilityStatusId === newStatusId) return;


  this.vehicleService.updateVehicleStatus(vehicle.vehicleId, newStatusId)
    .subscribe({
      next: () => {
        alert('Status updated successfully');
        this.loadVehicles(); // refresh
      },
      error: (err) => {
        alert(err?.error || 'Failed to update status');
      }
    });
}
}


