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


  constructor(private authService: AuthService, private router: Router) { }


  // if user already logged in, skip the login page
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      const redirect = this.authService.redirectBasedOnRole();
      this.router.navigate([redirect]);
    }
  }


  onSubmit() {
    // clear previous error before trying again
    this.error = '';


    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // redirect user to thier dashboard based on role
        const redirect = this.authService.redirectBasedOnRole();
        this.router.navigate([redirect]);
      },
      error: () => {
        this.error = 'Invalid email or password';
      }
    });
  }
}


