import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff } from '../../models/staff';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private API_URL = environment.API_URL + 'staff';

  constructor(private http: HttpClient) { }

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.API_URL);
  }

  addStaff(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.API_URL, staff);
  }

  updateStaff(staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.API_URL}/${staff.id}`, staff);
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  updateActive(id: number, active: number) {
    return this.http.patch(`${this.API_URL}/${id}`, { active });
  }

  getStaffTypes() {
    return this.http.get<{id: number, name: string}[]>(environment.API_URL + 'staff-types');
  }

  getPhases() {
    return this.http.get<{id: number, name: string}[]>(environment.API_URL + 'phases');
  }
}
