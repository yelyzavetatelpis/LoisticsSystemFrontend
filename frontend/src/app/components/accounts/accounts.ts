import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';


@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {


  users: any[] = [];


  // delete confirmation
  showDeleteModal = false;
  pendingDeleteId: number | null = null;


  // toast message
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadUsers();
  }


  // show toast for a few seconds
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }


  // fetch all users from api
  loadUsers(): void {
    this.accountsService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
      },
      error: () => this.showToast('Failed to load users', 'error')
    });
  }


  // go to register page to create a new user
  createUser(): void {
    this.router.navigate(['/register']);
  }


  // go to register page with an existing user to edit their information
  editUser(user: any): void {
    this.router.navigate(['/register', user.userId]);
  }


  // open the delete confirmation modal for a user
  openDeleteModal(userId: number): void {
    this.pendingDeleteId = userId;
    this.showDeleteModal = true;
  }


  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.pendingDeleteId = null;
  }


  // confirm the deletion and remove user from the list
  confirmDelete(): void {
    if (this.pendingDeleteId === null) return;


    this.accountsService.deleteUser(this.pendingDeleteId).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.userId !== this.pendingDeleteId);
        this.closeDeleteModal();
        this.showToast('User deleted successfully');
      },
      error: () => {
        this.closeDeleteModal();
        this.showToast('Failed to delete user', 'error');
      }
    });
  }
}


