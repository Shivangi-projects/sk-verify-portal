import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  userId = '';
  password = '';
  role = 'General User';

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  onLogin() {

    this.authService.login({
      userId: this.userId,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (response: any) => {

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        alert(
          error.error?.message ||
          'Login failed'
        );
      }
    });
  }
}