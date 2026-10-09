import { UserService } from '../../services/user';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


interface User {
  id: number;
  userId: string;
  name: string;
  role: 'Admin' | 'General User';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  users: User[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  editingId: number | null = null;

  form = {
    userId: '',
    password: '',
    name: '',
    role: 'General User' as User['role']
  };


  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('token')) {
      void this.router.navigate(['/']);
      return;
    }

    void this.loadUsers();
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
    };
  }
  goToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }
  async loadUsers(): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Session expired. Please log in again.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const users = await this.userService.getUsers(token);
      this.users = users;
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load users.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async saveUser(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const userId = this.form.userId.trim();
    const name = this.form.name.trim();
    const password = this.form.password;

    if (!name || (!this.editingId && (!userId || !password))) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.saving = true;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (this.editingId !== null) {
        await this.userService.updateUser(token, this.editingId, {
          name,
          role: this.form.role
        });

        this.successMessage = 'User updated successfully.';
      } else {
        await this.userService.createUser(token, {
          userId,
          password,
          name,
          role: this.form.role
        });

        this.successMessage = 'User created successfully.';
      }

      this.cancelEdit();
      await this.loadUsers();
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'Unable to save user.';
    } finally {
      this.saving = false;
    }
  }

  startEdit(user: User): void {
    this.editingId = user.id;
    this.form = {
      userId: user.userId,
      password: '',
      name: user.name,
      role: user.role
    };

    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = {
      userId: '',
      password: '',
      name: '',
      role: 'General User'
    };
  }

  async deleteUser(user: User): Promise<void> {
    if (typeof window === 'undefined') return;

    if (user.id === 1) {
      this.errorMessage = 'The primary admin account cannot be deleted.';
      return;
    }

    if (!window.confirm(`Delete user "${user.name}"?`)) return;

    this.errorMessage = '';
    this.successMessage = '';

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      await this.userService.deleteUser(token, user.id);

      this.successMessage = 'User deleted successfully.';
      await this.loadUsers();
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'Unable to delete user.';
    }
  }
}
