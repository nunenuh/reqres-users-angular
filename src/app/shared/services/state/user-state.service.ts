import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../../../features/users/models/user.model';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'  // This ensures a single instance across the app
})
export class UserStateService extends StateService<User> {
  private lastId = new BehaviorSubject<number>(0);

  constructor() {
    super();
  }

  // Override setState to track the last ID
  override setState(users: User[]) {
    super.setState(users);
    if (users.length > 0) {
      const maxId = Math.max(...users.map(u => u.id));
      this.lastId.next(maxId);
    }
  }

  // Override addItem to handle new user creation
  override addItem(user: User) {
    const currentState = this.state.value;
    const newId = this.lastId.value + 1;
    this.lastId.next(newId);
    
    // Add the new user to the beginning of the list
    const updatedUsers = [user, ...currentState];
    this.state.next(updatedUsers);
    
    // Update total count
    this.setTotal(this.getTotal() + 1);
  }

  // Add user with response from API
  addUserWithResponse(response: any) {
    const newUser: User = {
      id: parseInt(response.id) || this.lastId.value + 1,
      email: `${response.name.toLowerCase().replace(' ', '.')}@reqres.in`,
      first_name: response.name.split(' ')[0],
      last_name: response.name.split(' ')[1] || '',
      avatar: `https://reqres.in/img/faces/${this.lastId.value + 1}-image.jpg`
    };
    this.addItem(newUser);
  }

  // Update user with response from API
  updateUserWithResponse(id: number, response: any) {
    const updatedUser: User = {
      id: id,
      email: `${response.name.toLowerCase().replace(' ', '.')}@reqres.in`,
      first_name: response.name.split(' ')[0],
      last_name: response.name.split(' ')[1] || '',
      avatar: `https://reqres.in/img/faces/${id}-image.jpg`
    };
    this.updateItem(id, updatedUser);
  }

  // Get paginated users
  getPaginatedUsers(page: number, perPage: number): User[] {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return this.state.value.slice(start, end);
  }

  // Get paginated users as observable
  getPaginatedUsers$(page: number, perPage: number): Observable<User[]> {
    return this.state$.pipe(
      map(users => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return users.slice(start, end);
      })
    );
  }
} 