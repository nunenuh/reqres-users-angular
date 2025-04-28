import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private users = new BehaviorSubject<User[]>([]);
  users$ = this.users.asObservable();

  private currentPage = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPage.asObservable();

  private totalPages = new BehaviorSubject<number>(0);
  totalPages$ = this.totalPages.asObservable();

  constructor() {}

  setUsers(users: User[]) {
    this.users.next(users);
  }

  addUser(user: User) {
    const currentUsers = this.users.value;
    this.users.next([...currentUsers, user]);
  }

  updateUser(updatedUser: User) {
    const currentUsers = this.users.value;
    const index = currentUsers.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      currentUsers[index] = { ...currentUsers[index], ...updatedUser };
      this.users.next([...currentUsers]);
    }
  }

  deleteUser(userId: number) {
    const currentUsers = this.users.value;
    this.users.next(currentUsers.filter(user => user.id !== userId));
  }

  setCurrentPage(page: number) {
    this.currentPage.next(page);
  }

  setTotalPages(total: number) {
    this.totalPages.next(total);
  }

  getCurrentPage(): number {
    return this.currentPage.value;
  }

  getTotalPages(): number {
    return this.totalPages.value;
  }
} 