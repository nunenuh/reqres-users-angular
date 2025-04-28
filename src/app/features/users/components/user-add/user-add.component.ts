import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center mb-6">
          <button mat-icon-button (click)="goBack()" class="mr-4">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-bold text-gray-800">Add New User</h1>
        </div>

        <div class="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
          <p class="text-sm">
            <mat-icon class="align-middle mr-2">info</mat-icon>
            Note: This is a demo API. While the user will be "created" successfully, it won't be persisted 
            in the database. You'll see the API response, but the user won't appear in the list.
          </p>
        </div>

        <mat-card class="bg-white">
          <mat-card-content>
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="p-4">
              <div class="grid gap-6">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="first_name" placeholder="Enter first name">
                  <mat-error *ngIf="userForm.get('first_name')?.errors?.['required']">
                    First name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="last_name" placeholder="Enter last name">
                  <mat-error *ngIf="userForm.get('last_name')?.errors?.['required']">
                    Last name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="Enter email">
                  <mat-error *ngIf="userForm.get('email')?.errors?.['required']">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="userForm.get('email')?.errors?.['email']">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="flex justify-end mt-6">
                <button mat-button type="button" (click)="goBack()" class="mr-4">
                  Cancel
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid || isSubmitting">
                  <mat-icon class="mr-2">person_add</mat-icon>
                  Add User
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class UserAddComponent {
  userForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private userStateService: UserStateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const userData = this.userForm.value;
      
      this.userService.createUser({
        name: `${userData.first_name} ${userData.last_name}`,
        job: 'User'
      }).subscribe({
        next: (response) => {
          // Add the user to our local state
          this.userStateService.addUser({
            id: 0, // Will be set by state service
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            avatar: '' // Will be set by state service
          });

          this.snackBar.open('User added successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.snackBar.open('Error creating user', 'Close', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
} 