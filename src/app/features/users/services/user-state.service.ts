import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor() {}

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getCurrentUsers(): User[] {
    return this.users;
  }

  addUser(user: User) {
    // Generate a new ID (max + 1)
    const maxId = Math.max(...this.users.map(u => u.id), 0);
    const newUser = {
      ...user,
      id: maxId + 1,
      avatar: `https://reqres.in/img/faces/${maxId + 1}-image.jpg`
    };
    
    this.users = [...this.users, newUser];
    this.usersSubject.next(this.users);
  }

  setInitialUsers(users: User[]) {
    this.users = users;
    this.usersSubject.next(this.users);
  }
} 