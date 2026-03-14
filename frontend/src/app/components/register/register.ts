import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // form fields 
  firstName = '';
  lastName = '';
  email = '';
  mobileNumber = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // clear previous error 
    this.error = '';

    // password match validation before sending to the backend
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    //  every user registering from the frontend is a customer (roleId: 4)
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
      roleId: 4
    };

    this.authService.register(data).subscribe({
      next: () => {
        // redirect to login after registration
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // show error message if registration fails
        this.error = err.error.message || 'Registration failed';
      }
    });
  }
}