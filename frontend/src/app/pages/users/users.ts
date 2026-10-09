import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Auth } from '../../services/auth';
import { UserService } from '../../services/user';
import { Role, User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);
  private userService = inject(UserService);

  currentUser = this.auth.currentUser;

  users = signal<User[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  editingId = signal<number | null>(null);

  form = {
    userId: '',
    password: '',
    name: '',
    role: 'General User' as Role
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  goToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.userService
      .getUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.users.set(rows),
        error: (err) =>
          this.errorMessage.set(err.error?.message || 'Failed to load users.')
      });
  }

  saveUser(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const userId = this.form.userId.trim();
    const name = this.form.name.trim();
    const password = this.form.password;
    const editingId = this.editingId();

    if (!name || (editingId === null && (!userId || !password))) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    if (editingId === null && password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    this.saving.set(true);

    const request$ =
      editingId !== null
        ? this.userService.updateUser(editingId, { name, role: this.form.role })
        : this.userService.createUser({ userId, password, name, role: this.form.role });

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.successMessage.set(
          editingId !== null ? 'User updated successfully.' : 'User created successfully.'
        );
        this.cancelEdit();
        this.loadUsers();
      },
      error: (err) =>
        this.errorMessage.set(err.error?.message || 'Unable to save user.')
    });
  }

  startEdit(user: User): void {
    this.editingId.set(user.id);
    this.form = {
      userId: user.userId,
      password: '',
      name: user.name,
      role: user.role
    };
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form = { userId: '', password: '', name: '', role: 'General User' };
  }

  deleteUser(user: User): void {
    if (user.id === this.currentUser()?.id) {
      this.errorMessage.set('You cannot delete your own account.');
      return;
    }

    if (!window.confirm(`Delete user "${user.name}"?`)) return;

    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage.set('User deleted successfully.');
        this.loadUsers();
      },
      error: (err) =>
        this.errorMessage.set(err.error?.message || 'Unable to delete user.')
    });
  }
}