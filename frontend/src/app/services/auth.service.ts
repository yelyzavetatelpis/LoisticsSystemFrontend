import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode } from 'jwt-decode';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5209/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router) { }

  register(data: any): Observable<any> {
   
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: any): Observable<any> {
    debugger;
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
       if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);//added to store user role in local storage

        this.currentUserSubject.next({
          username: response.firstName,
          role: response.role
        });

      })
    );
  }
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
  redirectBasedOnRole(): string {

    const role = localStorage.getItem('userRole');

    switch (role) {
      case 'Admin':
        return '/dashboard';

      case 'Driver':
        return '/dashboarddriver';

      case 'Dispatcher':
        return '/dashboarddispatcher';

      case 'Customer':
        return '/dashboardcustomer';

      default:
        return '/login';
    }
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
getCurrentUserId(): number | null {
     debugger;
    const token = localStorage.getItem('authToken');

    if (!token) return null;

    try {
    const decoded: any = jwtDecode(token);

    console.log('Decoded Token:', decoded);

    const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    return id ? Number(id) : null;

   } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

}