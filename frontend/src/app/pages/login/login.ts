import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  userId = '';
  password = '';
  role: Role = 'General User';

  loading = signal(false);
  error = signal('');
  fillDemo(type: 'admin' | 'user'): void {
    if (type === 'admin') {
      this.userId = 'admin';
      this.password = 'admin123';
      this.role = 'Admin';
    } else {
      this.userId = 'user1';
      this.password = 'user123';
      this.role = 'General User';
    }
  }

  onLogin(): void {
    if (!this.userId.trim() || !this.password) {
      this.error.set('Please enter your User ID and password.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth
      .login({
        userId: this.userId.trim(),
        password: this.password,
        role: this.role
      })
      .subscribe({
        next: () => {
          void this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.error?.message || 'Unable to reach the server. Please try again.'
          );
        }
      });
  }
}