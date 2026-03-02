import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  mobileNumber = '';
  password = '';
  confirmPassword = '';
  error = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  onSubmit(): void {
    this.error = '';
   
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
      roleId: 4
    };

    this.authService.register(data).subscribe({
       
      next: (res: any) => {
          console.log("REGISTER RESPONSE:", res);
        this.successMessage = res.message;   // coming from .NET API
        this.error = '';
        this.cdr.detectChanges(); 

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);   // wait 4 seconds before redirect

      },
      error: (err) => {

        this.successMessage = '';
        this.error = err.error.message || 'Registration failed';

      }
    });
  }
}