import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DriverAvailabilityService, DriverAvailabilityDays } from '../../services/driver-availability.service';


const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type DayKey = (typeof DAY_KEYS)[number];


@Component({
  selector: 'app-driveravailability',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './driveravailability.component.html',
  styleUrls: ['./driveravailability.component.css']
})
export class DriverAvailabilityComponent implements OnInit {


  isAvailable = true;
  availableDays: Record<DayKey, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };
  dayKeys = DAY_KEYS;
  saving = false;
  loading = false;
  saveMessage = '';
  loadError = '';


  constructor(
    private driverAvailabilityService: DriverAvailabilityService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadAvailability();
  }


  private mapResponseToDays(availableDays?: DriverAvailabilityDays): Record<DayKey, boolean> {
    return {
      monday: availableDays?.monday ?? false,
      tuesday: availableDays?.tuesday ?? false,
      wednesday: availableDays?.wednesday ?? false,
      thursday: availableDays?.thursday ?? false,
      friday: availableDays?.friday ?? false,
      saturday: availableDays?.saturday ?? false,
      sunday: availableDays?.sunday ?? false
    };
  }


  getDayLabel(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1);
  }


  loadAvailability(): void {
    this.loading = true;
    this.loadError = '';
    this.driverAvailabilityService.getMyAvailability().subscribe({
      next: (res) => {
        this.isAvailable = res.isAvailable;
        this.availableDays = this.mapResponseToDays(res.availableDays);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.error?.message || 'Failed to load availability.';
        this.loading = false;
      }
    });
  }


  saveAvailability(): void {
    this.saving = true;
    this.saveMessage = '';
    this.loadError = '';
    const payload = {
  isAvailable: true,
  availableDays: this.availableDays,
  specificDates: [] as string[]
};


    this.driverAvailabilityService.saveMyAvailability(payload).subscribe({
      next: () => {
        this.saving = false;
        this.saveMessage = 'Availability saved successfully.';
        setTimeout(() => (this.saveMessage = ''), 3000);
      },
      error: (err) => {
        this.saving = false;
        this.loadError = err?.error?.message || 'Failed to save availability.';
      }
    });
  }
}


