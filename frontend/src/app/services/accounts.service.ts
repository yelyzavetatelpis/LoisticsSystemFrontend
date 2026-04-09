import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl = 'https://localhost:7018/api/accounts';


  constructor(private http: HttpClient) {}


  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }


  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }


  updateUser(user: any) {
    return this.http.put(`${this.apiUrl}/${user.userId}`, user);
  }
  getDrivers() {
  return this.http.get<any[]>(`${this.apiUrl}/drivers`);
}
}



