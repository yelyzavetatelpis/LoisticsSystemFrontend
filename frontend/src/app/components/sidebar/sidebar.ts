import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: [`
    .sidebar {
      width: 230px;
      height: 100vh;
      background: #1C1D36;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      padding: 40px 24px;
    }
    .logo-section h3 {
      font-weight: 800;
      letter-spacing: -0.5px;
      font-size: 1.6rem;
    }
    .nav-link {
      padding: 14px 20px;
      border-radius: 12px;
      transition: all 0.2s ease;
      color: #8E92B2 !important;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      font-weight: 600;
      border: none;
      font-size: 0.95rem;
    }
    .nav-link i {
      font-size: 1.2rem;
      margin-right: 16px;
    }
    .nav-link:hover {
      color: #FFFFFF !important;
      background: rgba(255, 255, 255, 0.03);
    }
    .nav-link.active {
      background: #D9EFFF;
      color: #1C1D36 !important;
    }
    .upgrade-card {
      background: #2D2E49;
      border-radius: 20px;
      padding: 24px;
      margin-top: 40px;
      position: relative;
      overflow: hidden;
    }
    .upgrade-card::before {
        content: '';
        position: absolute;
        top: -20px;
        right: -20px;
        width: 80px;
        height: 80px;
        background: rgba(255,255,255,0.05);
        border-radius: 50%;
    }
    .btn-upgrade {
        background: #FFFFFF;
        color: #1C1D36;
        border: none;
        border-radius: 10px;
        padding: 8px;
        font-weight: 700;
        font-size: 0.85rem;
        width: 100%;
        margin-top: 15px;
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}