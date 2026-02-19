import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CareLinkModel } from '../models/carelink.model';

@Injectable({
  providedIn: 'root'
})
export class CareLinkService {

  private apiUrl = 'http://localhost:8080/api/care-links';

  constructor(private http: HttpClient) {}

  getCareLinksByCaregiver(caregiverId: number): Observable<CareLinkModel[]> {
    return this.http.get<CareLinkModel[]>(
      `${this.apiUrl}/by-caregiver?caregiverId=${caregiverId}`
    );
  }

  getCareLinksBySenior(seniorId: number): Observable<CareLinkModel[]> {
    return this.http.get<CareLinkModel[]>(
      `${this.apiUrl}/by-senior?seniorId=${seniorId}`
    );
  }

  createCareLink(caregiverId: number, seniorId: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      caregiverId,
      seniorId
    });
  }

  deleteCareLink(caregiverId: number, seniorId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}?caregiverId=${caregiverId}&seniorId=${seniorId}`
    );
  }
}
