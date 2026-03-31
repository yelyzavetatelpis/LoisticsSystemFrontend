import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountsService } from '../../services/accounts.service';

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
  licenseNumber = '';
  error = '';

  // role and edit mode state
  roleId: number | null = null;
  userRole: string | null = '';
  isEditMode = false;
  userId: number | null = null;

  constructor(
    private authService: AuthService,
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();

    // check if we're editing an existing user
    const id = this.route.snapshot.paramMap.get('id');


    if (id) {
      this.isEditMode = true;

      // load the existing data in form
      this.authService.getUserById(+id).subscribe(user => {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.mobileNumber = user.mobileNumber;
        this.roleId = user.roleId;
        this.licenseNumber = user.licenseNumber;
        this.cdr.detectChanges();
      });
    }
  }

  goBack() {
    this.router.navigate(['/accounts']);
  }

  onSubmit(): void {
    this.error = '';

    // client-side password check before sending to api
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const data: any = {
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      roleId: this.roleId ?? 4,
      licenseNumber: this.licenseNumber
    };


    // only include password in the payload if teh user filled it in
    if (this.password && this.password.trim() !== '') {
      data.password = this.password;
    }


    if (this.isEditMode) {
      // update an existing user
      this.accountsService.updateUser(data).subscribe({
        next: () => {
          this.router.navigate(['/accounts']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Update failed';
        }
      });
    } else {
      // register a new user
      this.authService.register(data).subscribe({
        next: () => {
          this.router.navigate(['/accounts']);
        },
        error: (err) => {
          this.error = err?.error?.message || err?.error || err?.message || 'Registration failed';
        }
      });
    }
  }
}


