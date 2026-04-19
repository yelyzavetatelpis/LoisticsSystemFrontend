import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl = 'https://localhost:7018/api/accounts';


  constructor(private http: HttpClient) {}


  // get all users for admin user management
  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }


  // delete user by id
  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }


  // update user details
  updateUser(user: any) {
    return this.http.put(`${this.apiUrl}/${user.userId}`, user);
  }


  // get all drivers for drivers management page
  getDrivers() {
    return this.http.get<any[]>(`${this.apiUrl}/drivers`);
  }
}


