import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-driveravailability',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './driveravailability.component.html',
  styleUrls: ['./driveravailability.component.css']
})
export class DriverAvailabilityComponent implements OnInit {
  ngOnInit(): void {
    
  }
}