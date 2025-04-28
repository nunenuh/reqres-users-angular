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

  constructor(private userService: UserService, private router: Router) {
    console.log('UserListComponent constructed');
  }

  ngOnInit(): void {
    console.log('UserListComponent initialized');
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Loading users...');
    this.loading = true;
    this.userService.getUsers(this.pageIndex + 1).subscribe({
      next: (response) => {
        console.log('Users loaded successfully:', response);
        this.users = response.data;
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

  handlePageEvent(event: PageEvent): void {
    console.log('Page event:', event);
    this.pageIndex = event.pageIndex;
    this.loadUsers();
  }

  viewUserDetails(id: number): void {
    console.log('Navigating to user details:', id);
    this.router.navigate(['/users', id]);
  }
} 