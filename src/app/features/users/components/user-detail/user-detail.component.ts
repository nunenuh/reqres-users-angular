import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.userService.getUser(+id).subscribe({
        next: (response) => {
          this.user = response.data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching user:', error);
          this.loading = false;
          this.error = true;
        }
      });
    } else {
      this.router.navigate(['/users']);
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
} 