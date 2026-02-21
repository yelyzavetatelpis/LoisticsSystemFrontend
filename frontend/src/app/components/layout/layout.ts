import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './layout.component.html',
  styles: [`
    .main-layout {
      display: flex;
      min-height: 100vh;
      background-color: #F8F9FE;
      overflow-x: hidden;
    }
    .content-area {
      flex: 1;
      margin-left: 240px;
      min-height: 100vh;
      position: relative;
      background: #F8F9FE;
    }
    .top-bar {
      height: 90px;
      padding: 0 40px;
      background: #F8F9FE;
      position: sticky;
      top: 0;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .search-container {
      width: 440px;
      position: relative;
    }
    .search-container i {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #8E92B2;
    }
    .search-container input {
      width: 100%;
      padding: 12px 20px 12px 50px;
      background: #FFFFFF;
      border: none;
      border-radius: 30px;
      font-size: 0.9rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      color: #1C1D36;
    }
    .user-profile img {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      object-fit: cover;
    }
    .notification-btn {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1C1D36;
      border: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      position: relative;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #FF4D4D;
      border-radius: 50%;
      position: absolute;
      top: 12px;
      right: 12px;
      border: 2px solid #FFFFFF;
    }
    .user-dropdown {
      position: relative;
    }
    .user-dropdown img {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .user-dropdown img:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    .dropdown-menu {
      position: absolute;
      top: 60px;
      right: 0;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      min-width: 220px;
      z-index: 1000;
      animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .dropdown-header {
      padding: 12px 16px;
      text-align: center;
    }
    .dropdown-header strong {
      display: block;
      color: #1C1D36;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    .dropdown-header small {
      color: #8E92B2;
      font-size: 0.8rem;
    }
    .dropdown-menu hr {
      margin: 8px 0;
      border: none;
      border-top: 1px solid #E8EBFF;
    }
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 16px;
      text-align: left;
      background: none;
      border: none;
      color: #4B5570;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .dropdown-item:hover {
      background-color: #F8F9FE;
      color: #667eea;
      padding-left: 20px;
    }
    .dropdown-item i {
      margin-right: 8px;
      width: 18px;
    }
    .logout-btn {
      color: #E74C3C;
    }
    .logout-btn:hover {
      background-color: #fff5f5;
      color: #C0392B;
    }
  `]
})
export class LayoutComponent {
  currentUser$ = inject(AuthService).currentUser$;
  private authService = inject(AuthService);
  showUserDropdown = false;

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.showUserDropdown = false;
  }
}