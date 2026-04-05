import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CareLinkModel } from '../models/carelink.model';

@Injectable({
  providedIn: 'root',
})
export class CareLinkService {
  private apiUrl = 'http://localhost:8080/api/care-links';

  constructor(private http: HttpClient) {}

  // Get all connections for a senior
  getConnectionsBySenior(seniorId: number): Observable<CareLinkModel[]> {
    return this.http.get<CareLinkModel[]>(`${this.apiUrl}/senior/${seniorId}`);
  }

  // Create a new connection
  createConnection(caregiverId: number, seniorId: number): Observable<CareLinkModel> {
    return this.http.post<CareLinkModel>(`${this.apiUrl}/create`, { caregiverId, seniorId });
  }

  // Delete a connection
  deleteConnection(caregiverId: number, seniorId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, { caregiverId, seniorId });
  }
}
