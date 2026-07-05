import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Log in</h1>
        <form #form="ngForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Username</label>
            <input
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              minlength="3"
              #usernameField="ngModel"
            />
            <small *ngIf="usernameField.invalid && usernameField.touched">
              Username must be at least 3 characters
            </small>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordField="ngModel"
            />
            <small *ngIf="passwordField.invalid && passwordField.touched">
              Password must be at least 6 characters
            </small>
          </div>
          <p *ngIf="error" class="error">{{ error }}</p>
          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>
        </form>
        <p class="switch">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
