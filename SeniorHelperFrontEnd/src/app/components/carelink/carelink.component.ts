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

  newSeniorId: number | null = null;
  newCaregiverId: number | null = null;
  newFirstName: string = '';
  newLastName: string = '';

  constructor(private carelinkService: CareLinkService) {}

  ngOnInit(): void {
    this.loadConnections();
  }

  loadConnections(): void {
    const loggedInSeniorId = 1; // Replace with dynamic ID from authService
    this.carelinkService.getConnectionsBySenior(loggedInSeniorId)
      .subscribe({
        next: (data: CareLinkModel[]) => this.connections = data,
        error: err => console.error('Error fetching connections', err)
      });
  }

  createConnection(): void {
    if (this.newSeniorId && this.newCaregiverId) {
      // Temporary connection to show immediately
      const tempConnection: CareLinkModel = {
        userId: this.newCaregiverId,
        caregiverName: `${this.newLastName}, ${this.newFirstName}`,
        role: 'Pending', // temporary placeholder role
        connectedSince: new Date().toISOString()
      };

      // Show immediately
      this.connections.push(tempConnection);

      // Call backend API
      this.carelinkService.createConnection(this.newCaregiverId, this.newSeniorId)
        .subscribe({
          next: (created: CareLinkModel) => {
            // Replace temp connection with actual response
            const index = this.connections.indexOf(tempConnection);
            if (index !== -1) this.connections[index] = created;
            this.resetForm();
          },
          error: err => {
            console.error('Error creating connection', err);
            // Remove temp object on error
            this.connections = this.connections.filter(c => c !== tempConnection);
          }
        });
    }
  }

  deleteConnection(conn: CareLinkModel): void {
    this.carelinkService.deleteConnection(conn.userId, this.newSeniorId!)
      .subscribe({
        next: () => {
          this.connections = this.connections.filter(c => c !== conn);
        },
        error: err => console.error('Error deleting connection', err)
      });
  }

  private resetForm(): void {
    this.newSeniorId = null;
    this.newCaregiverId = null;
    this.newFirstName = '';
    this.newLastName = '';
  }
}
