import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar';


interface CurrentUser {
  username: string;
  role: string;
}


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {


  currentUser$: Observable<CurrentUser | null>;
  showUserDropdown = false;


  constructor(private authService: AuthService) {
    // subscribe to the current user from the auth service
    this.currentUser$ = this.authService.currentUser$;
  }


  // toggle avatar dropdown
  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }


  logout(): void {
    this.authService.logout();
    this.showUserDropdown = false;
  }
}


