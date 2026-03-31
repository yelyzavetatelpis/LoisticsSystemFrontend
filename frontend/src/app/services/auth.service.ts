import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'https://localhost:7018/api/auth';


  // track the current user across the pages
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient, private router: Router) {
    // restore user state from localstorage on app load
    const firstName = localStorage.getItem('firstName');
    const role = localStorage.getItem('userRole');


    if (firstName && role) {
      this.currentUserSubject.next({ username: firstName, role: role });
    }
  }

  // send registration data to the backend
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // log in and save token, role and name to localstorage
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('firstName', response.firstName);


        this.currentUserSubject.next({
          username: response.firstName,
          role: response.role
        });
      })
    );
  }

  // get the stored role of the current user
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // return the correct dashboard route based on role
  redirectBasedOnRole(): string {
    const role = localStorage.getItem('userRole');
    switch (role) {
      case 'Admin':      return '/dashboard';
      case 'Driver':     return '/trips';
      case 'Dispatcher': return '/dashboarddispatcher';
      case 'Customer':   return '/dashboardcustomer';
      default:           return '/login';
    }
  }

  // check if a token exists in localstorage
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // clear all user data and send back to login
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('firstName');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // decode the jwt
  getCurrentUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return id ? Number(id) : null;
    } catch {
      return null;
    }
  }

  // get user from localstorage
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // fetch user by id from api
  getUserById(id: number) {
    return this.http.get<any>(`https://localhost:7018/api/accounts/${id}`);
  }
}


