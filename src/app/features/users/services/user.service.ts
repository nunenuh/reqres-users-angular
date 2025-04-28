import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { SingleUserResponse, UserResponse, CreateUserResponse, UpdateUserResponse } from '../models/user.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserStateService } from '../../../shared/services/state/user-state.service';

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
    private notification: NotificationService,
    private userState: UserStateService
  ) { }

  getUsers(page: number = 1): Observable<UserResponse> {
    this.loading.setLoading(true);
    return this.http.get<UserResponse>(`${this.apiUrl}?page=${page}`, { headers: this.headers })
      .pipe(
        tap(response => {
          this.userState.setState(response.data);
          this.userState.setCurrentPage(response.page);
          this.userState.setTotalPages(response.total_pages);
          this.userState.setPerPage(response.per_page);
          this.userState.setTotal(response.total);
        }),
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

  createUser(user: { name: string, job: string }): Observable<CreateUserResponse> {
    this.loading.setLoading(true);
    return this.http.post<CreateUserResponse>(this.apiUrl, user, { headers: this.headers })
      .pipe(
        tap(response => {
          this.userState.addUserWithResponse(response);
          this.notification.showSuccess('User created successfully');
        }),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }

  updateUser(id: number, user: { name: string, job: string }): Observable<UpdateUserResponse> {
    this.loading.setLoading(true);
    return this.http.put<UpdateUserResponse>(`${this.apiUrl}/${id}`, user, { headers: this.headers })
      .pipe(
        tap(response => {
          this.userState.updateUserWithResponse(id, response);
          this.notification.showSuccess('User updated successfully');
        }),
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
        tap(() => {
          this.userState.deleteItem(id);
          this.notification.showSuccess('User deleted successfully');
        }),
        catchError(error => {
          this.errorHandler.handleError(error);
          throw error;
        }),
        finalize(() => this.loading.setLoading(false))
      );
  }
} 