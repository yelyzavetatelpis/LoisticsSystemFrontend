import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';


const SHIPMENT_STATUS_OPTIONS = [
  { value: 'Pending',   label: 'Pending' },
  { value: 'Picked Up', label: 'Picked Up' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Failed',    label: 'Failed' }
];


@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {


  trips: any[] = [];
  tripShipments: any[] = [];
  selectedTripId: number | null = null;
  userRole: string | null = null;
  startTripLoading = false;
  startTripError = '';
  updatingShipmentId: number | null = null;
  shipmentStatusOptions = SHIPMENT_STATUS_OPTIONS;


  timeOfDay = '';
  driverName = '';
  currentDate = '';


  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();


    // greeting based on teh current hour
    const hour = new Date().getHours();
    if (hour < 12) this.timeOfDay = 'Morning';
    else if (hour < 17) this.timeOfDay = 'Afternoon';
    else this.timeOfDay = 'Evening';


    this.authService.currentUser$.subscribe(user => {
      this.driverName = user?.username ?? '';
    });


    this.currentDate = new Date().toDateString();
    this.loadTrips();
  }


  // load all trips from the api
  loadTrips(): void {
    this.orderService.getTrips().subscribe({
      next: (res: any) => {
        this.trips = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load trips', err)
    });
  }


  // load shipments for a selected trip
  viewTrip(tripId: number): void {
    this.selectedTripId = tripId;
    this.startTripError = '';
    this.orderService.getTripShipments(tripId).subscribe({
      next: (res: any) => {
        this.tripShipments = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load trip shipments', err);
        this.tripShipments = [];
        this.cdr.detectChanges();
      }
    });
  }


  closeTripModal(): void {
    this.selectedTripId = null;
    this.startTripError = '';
  }


  // update a shipments status and refresh the trip view
  updateShipmentStatus(shipment: any, newStatus: string): void {
    if (!this.selectedTripId || !shipment?.shipmentId || shipment.statusName === newStatus) return;


    this.updatingShipmentId = shipment.shipmentId;
    this.orderService.updateShipmentStatus(shipment.shipmentId, newStatus).subscribe({
      next: () => {
        this.updatingShipmentId = null;
        this.orderService.getTripShipments(this.selectedTripId!).subscribe((res: any) => {
          this.tripShipments = res;
          this.cdr.detectChanges();
        });
        this.loadTrips();
      },
      error: (err) => {
        this.updatingShipmentId = null;
        console.error('Failed to update shipment status', err);
        this.cdr.detectChanges();
      }
    });
  }


  get selectedTrip(): any {
    return this.trips.find((t: any) => t.tripId === this.selectedTripId) || null;
  }


  // start a planned trip and refresh the view
  startTrip(tripId: number): void {
    this.startTripLoading = true;
    this.startTripError = '';
    this.orderService.startTrip(tripId).subscribe({
      next: () => {
        this.startTripLoading = false;
        this.loadTrips();
        this.viewTrip(tripId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.startTripLoading = false;
        this.startTripError = err?.error?.message || 'Failed to start trip.';
        this.cdr.detectChanges();
      }
    });
  }
}



