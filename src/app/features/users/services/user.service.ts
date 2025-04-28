import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleUserResponse, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) { }

  getUsers(page: number = 1): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}?page=${page}`);
  }

  getUser(id: number): Observable<SingleUserResponse> {
    return this.http.get<SingleUserResponse>(`${this.apiUrl}/${id}`);
  }

  createUser(user: { name: string, job: string }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(id: number, user: { name: string, job: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 