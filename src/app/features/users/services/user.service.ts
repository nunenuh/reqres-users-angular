import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { SingleUserResponse, UserResponse } from '../models/user.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-API-Key': 'reqres-free-v1'
  });

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private loading: LoadingService,
    private notification: NotificationService
  ) { }

  getUsers(page: number = 1): Observable<UserResponse> {
    this.loading.setLoading(true);
    return this.http.get<UserResponse>(`${this.apiUrl}?page=${page}`, { headers: this.headers })
      .pipe(
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }

  getUser(id: number): Observable<SingleUserResponse> {
    this.loading.setLoading(true);
    return this.http.get<SingleUserResponse>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }

  createUser(user: { name: string, job: string }): Observable<any> {
    this.loading.setLoading(true);
    return this.http.post(this.apiUrl, user, { headers: this.headers })
      .pipe(
        tap(() => this.notification.showSuccess('User created successfully')),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }

  updateUser(id: number, user: { name: string, job: string }): Observable<any> {
    this.loading.setLoading(true);
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers: this.headers })
      .pipe(
        tap(() => this.notification.showSuccess('User updated successfully')),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }

  deleteUser(id: number): Observable<any> {
    this.loading.setLoading(true);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(
        tap(() => this.notification.showSuccess('User deleted successfully')),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }
} 