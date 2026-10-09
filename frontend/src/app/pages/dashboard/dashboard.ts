import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  user: any = null;
  records: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) { }

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

      // Show the loading indicator during simulated API processing.
      this.loading = true;
      this.cdr.detectChanges();

      const recordsRes = await fetch(
        'http://localhost:5001/api/records?delay=3000',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!recordsRes.ok) {
        throw new Error('Could not load records.');
      }

      this.records = await recordsRes.json();
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
}