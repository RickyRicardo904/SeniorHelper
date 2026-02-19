import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CareLinkService } from '../../services/carelink.service';
import { CareLinkModel } from '../../models/carelink.model';

@Component({
  selector: 'app-carelink',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carelink.component.html',
  styleUrls: ['./carelink.component.css']
})
export class CarelinkComponent implements OnInit {

  connections: CareLinkModel[] = [];

  caregiverId!: number;
  seniorId!: number;

  currentUserId!: number;
  currentUserRole!: string;

  constructor(private careLinkService: CareLinkService) {}

  ngOnInit(): void {
    this.loadUserFromStorage();
    this.loadConnections();
  }

  private loadUserFromStorage(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.currentUserId = user.id;
    this.currentUserRole = user.role;
  }

  private loadConnections(): void {

    if (this.currentUserRole === 'Caregiver') {
      this.careLinkService
        .getCareLinksByCaregiver(this.currentUserId)
        .subscribe({
          next: (data) => this.connections = data,
          error: (err: any) => console.error(err)
        });

    } else if (this.currentUserRole === 'Senior') {
      this.careLinkService
        .getCareLinksBySenior(this.currentUserId)
        .subscribe({
          next: (data) => this.connections = data,
          error: (err: any) => console.error(err)
        });
    }
  }

  createConnection(): void {

    if (!this.caregiverId || !this.seniorId) {
      alert('Both IDs are required.');
      return;
    }

    this.careLinkService
      .createCareLink(this.caregiverId, this.seniorId)
      .subscribe({
        next: () => {
          alert('Connection created successfully.');
          this.loadConnections();
          this.caregiverId = 0;
          this.seniorId = 0;
        },
        error: (err: any) => console.error(err)
      });
  }

  deleteConnection(caregiverId: number, seniorId: number): void {

    if (!confirm('Are you sure you want to delete this connection?')) {
      return;
    }

    this.careLinkService
      .deleteCareLink(caregiverId, seniorId)
      .subscribe({
        next: () => {
          this.loadConnections();
        },
        error: (err: any) => console.error(err)
      });
  }
}
