import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PortalUser {
  id: number;
  userId: string;
  name: string;
  role: 'Admin' | 'General User';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  user: any = null;
  records: any[] = [];
  portalUsers: PortalUser[] = [];

  loading = true;
  usersLoading = false;

  errorMessage = '';
  usersError = '';
  delay = 3000;
  delayOptions = [0, 3000, 5000, 8000];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Please log in to continue.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      const userRes = await fetch(
        'http://localhost:5001/api/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!userRes.ok) {
        throw new Error('Could not load user details.');
      }

      this.user = await userRes.json();
      this.cdr.detectChanges();

      // Admins can also view the current portal users.
      if (this.user?.role === 'Admin') {
        await this.loadPortalUsers();
      }

      await this.loadRecords();
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading the dashboard.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
  async loadRecords(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const res = await fetch(
        `http://localhost:5001/api/records?delay=${this.delay}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Could not load records.');
      this.records = await res.json();
    } catch (e) {
      this.errorMessage =
        e instanceof Error ? e.message : 'Could not load records.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
  async loadPortalUsers(): Promise<void> {
    if (this.usersLoading) {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.usersError = 'Session expired. Please log in again.';
      this.usersLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.usersLoading = true;
    this.usersError = '';
    this.cdr.detectChanges();

    try {
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to load users (${response.status}).`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('The server returned an unexpected users response.');
      }

      this.portalUsers = data;
    } catch (error) {
      this.usersError =
        error instanceof Error
          ? error.message
          : 'Unable to load portal users. Please try again.';
    } finally {
      this.usersLoading = false;
      this.cdr.detectChanges();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    void this.router.navigate(['/']);
  }

  goToUsers(): void {
    void this.router.navigate(['/users']);
  }
}