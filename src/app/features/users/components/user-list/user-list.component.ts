import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  totalUsers = 0;
  pageSize = 6;
  pageIndex = 0;

  constructor(
    private userService: UserService, 
    private userStateService: UserStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user state changes
    this.userStateService.getUsers().subscribe(users => {
      if (users.length > 0) {
        this.handleUsersUpdate(users);
      } else {
        this.loadUsersFromApi();
      }
    });
  }

  private loadUsersFromApi(): void {
    this.loading = true;
    this.userService.getUsers(this.pageIndex + 1).subscribe({
      next: (response) => {
        // Initialize state with API data
        this.userStateService.setInitialUsers(response.data);
        this.totalUsers = response.total;
        this.pageSize = response.per_page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  private handleUsersUpdate(users: User[]): void {
    // Calculate pagination
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.users = users.slice(start, end);
    this.totalUsers = users.length;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    const users = this.userStateService.getCurrentUsers();
    this.handleUsersUpdate(users);
  }

  viewUserDetails(id: number): void {
    this.router.navigate(['/users', id]);
  }
} 