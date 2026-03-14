import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // form fields 
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  //skip the login page if the user is logged in
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      const redirectUrl = this.authService.redirectBasedOnRole();
      this.router.navigate([redirectUrl]);
    }
  }

  onSubmit() {
    // clear previous error 
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // redirect to the dashboard based on user's role
        const redirectUrl = this.authService.redirectBasedOnRole();
        this.router.navigate([redirectUrl]);
      },
      error: () => {
        this.error = 'Invalid email or password';
      }
    });
  }
}