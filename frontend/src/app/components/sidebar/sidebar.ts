import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // store the current user's role to show the correct nav links
  userRole: string | null = '';

  constructor(private authService: AuthService) {}

  // get the user's role when the sidebar loads
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
  }

  // clear the token and redirect to login
  logout() {
    this.authService.logout();
  }
}