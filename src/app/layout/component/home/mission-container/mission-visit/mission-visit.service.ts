import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Visit } from '../../../models/visit';
import { Battelion } from '../../../models/battelion';
import { Unit } from '../../../models/unit';

@Injectable({
  providedIn: 'root'
})
export class MissionVisitService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getVisitsByMissionId(missionId: string | undefined): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.API_URL + 'mission-visits?mission_id=' + missionId);
  }

  getBattelions(): Observable<Battelion[]> {
    return this.http.get<Battelion[]>(this.API_URL + 'battelion-list');
  }

  getUnits(missionId: string | undefined): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.API_URL + 'units-from-battelions?mission_id=' + missionId);
  }

  addVisit(visit: Visit): Observable<any> {
    return this.http.post<any>(this.API_URL + 'mission-visits', visit);
  }

  updateVisit(visit: Visit): Observable<any> {
    return this.http.put<any>(this.API_URL + 'mission-visits/' + visit.id, visit);
  }

  deleteVisit(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + 'mission-visits/' + id);
  }

  uploadVisitReport(formData: FormData): Observable<any> {
    return this.http.post<any>(this.API_URL + 'upload-visit-report', formData);
  }

  deleteVisitFile(visitId: number) {
    return this.http.delete<any>(this.API_URL + '/delete-report/' + visitId);
  }
}
