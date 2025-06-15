import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Staff } from '../../../models/staff';


@Injectable({
  providedIn: 'root'
})
export class MissionStaffService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getStaff(id: string | undefined = undefined): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.API_URL + 'staff-grouped' + (id ? '?id=' + id : ''));
  }

  addStaff(staff: number[], id: string | undefined): Observable<Staff[]> {
    return this.http.post<Staff[]>(this.API_URL + 'mission-staff', {'mission_id': id, 'staff_ids': staff });
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete(this.API_URL + 'mission-staff/' + id);
  }

  getStaffByMissionId(missionId: string) {
    return this.http.get<Staff[]>(this.API_URL + 'mission-staff?mission_id=' + missionId);
  }
}
