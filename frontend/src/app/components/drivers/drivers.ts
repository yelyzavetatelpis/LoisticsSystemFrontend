import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsService } from '../../services/accounts.service';


@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {


  drivers: any[] = [];
  loading = false;


  constructor(
    private accountsService: AccountsService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadDrivers();
  }


  // fetch all drivers with their availability status
  loadDrivers(): void {
    this.loading = true;
    this.accountsService.getDrivers().subscribe({
      next: (res) => {
        this.drivers = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }
}



