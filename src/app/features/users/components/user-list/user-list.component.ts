import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserStateService } from '../../../../shared/services/state/user-state.service';

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
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  totalUsers = 0;
  pageSize = 6;
  pageIndex = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService, 
    private userState: UserStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to state changes
    this.subscriptions.push(
      // Subscribe to paginated users
      this.userState.getPaginatedUsers$(this.pageIndex + 1, this.pageSize)
        .subscribe((users: User[]) => {
          this.users = users;
        }),

      this.userState.total$.subscribe((total: number) => {
        this.totalUsers = total;
      }),

      this.userState.perPage$.subscribe((perPage: number) => {
        if (perPage > 0) {
          this.pageSize = perPage;
        }
      })
    );

    // Load initial data if state is empty
    if (this.userState.getTotal() === 0) {
      this.loadUsersFromApi();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUsersFromApi(): void {
    this.loading = true;
    this.userService.getUsers(this.pageIndex + 1).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsersFromApi();
  }

  viewUserDetails(id: number): void {
    this.router.navigate(['/users', id]);
  }
} 