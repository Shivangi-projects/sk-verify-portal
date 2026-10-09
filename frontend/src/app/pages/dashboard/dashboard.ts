import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Auth } from '../../services/auth';
import { RecordService } from '../../services/record';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';
import { VerificationRecord } from '../../models/record.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private recordService = inject(RecordService);
  private userService = inject(UserService);

  user = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;

  records = signal<VerificationRecord[]>([]);
  portalUsers = signal<User[]>([]);

  loadingRecords = signal(false);
  loadingUsers = signal(false);
  recordsError = signal('');
  usersError = signal('');

  delay = 3000;
  delayOptions = [0, 3000, 5000, 8000];

  ngOnInit(): void {
    // Both requests start together and finish independently (async processing).
    this.loadRecords();

    if (this.isAdmin()) {
      this.loadPortalUsers();
    }
  }

  loadRecords(): void {
    this.loadingRecords.set(true);
    this.recordsError.set('');

    this.recordService
      .getRecords(this.delay)
      .pipe(finalize(() => this.loadingRecords.set(false)))
      .subscribe({
        next: (rows) => this.records.set(rows),
        error: (err) =>
          this.recordsError.set(err.error?.message || 'Could not load records.')
      });
  }

  loadPortalUsers(): void {
    this.loadingUsers.set(true);
    this.usersError.set('');

    this.userService
      .getUsers()
      .pipe(finalize(() => this.loadingUsers.set(false)))
      .subscribe({
        next: (rows) => this.portalUsers.set(rows),
        error: (err) =>
          this.usersError.set(err.error?.message || 'Could not load users.')
      });
  }

  goToUsers(): void {
    void this.router.navigate(['/users']);
  }

  logout(): void {
    this.auth.logout();
  }
}