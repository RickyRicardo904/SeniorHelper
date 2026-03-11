<<<<<<< HEAD
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AppointmentDto {
  id?: number;
  title: string;
  notes: string;
  location: string;
  start: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(seniorId: number, appointment: AppointmentDto): Observable<AppointmentDto> {
    const params = new HttpParams().set('seniorId', seniorId);

    return this.http.post<AppointmentDto>(
      this.baseUrl,
      appointment,
      { params }
    );
  }
}
=======
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/me`);
  }
}
>>>>>>> 6c0b53fb3be5e8c0fff6bd2c5faba7c5267bda29
