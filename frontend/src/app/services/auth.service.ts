import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5209/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any): Observable<any> {
    debugger;
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: any): Observable<any> {
    debugger;
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.currentUserSubject.next(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
      })
    );
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
}