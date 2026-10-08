import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [CommonModule]
})
export class Dashboard implements OnInit {

  user: any = null;
  records: any[] = [];

  async ngOnInit() {

    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    console.log('TOKEN = ', token);

    const userRes = await fetch(
      'http://localhost:5001/api/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('USER STATUS = ', userRes.status);

    this.user = await userRes.json();

    console.log('USER DATA = ', this.user);

    const recordsRes = await fetch(
      'http://localhost:5001/api/records?delay=3000',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('RECORD STATUS = ', recordsRes.status);

    this.records = await recordsRes.json();

    console.log('RECORDS = ', this.records);
  }
}