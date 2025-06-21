import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { MissionBattelion, Battelion } from '../../../models/battelion';

@Injectable({
  providedIn: 'root'
})
export class MissionBattelionService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getBattelionsByMissionId(missionId: string): Observable<MissionBattelion[]> {
    return this.http.get<MissionBattelion[]>(this.API_URL + 'mission-battelions?mission_id=' + missionId);
  }

  getBattelions(): Observable<Battelion[]> {
    return this.http.get<Battelion[]>(this.API_URL + 'battelion-list');
  }

  addBattelion(battelion: MissionBattelion): Observable<any> {
    return this.http.post<any>(this.API_URL + 'mission-battelions', battelion);
  }

  updateBattelion(battelion: MissionBattelion): Observable<any> {
    return this.http.put<any>(this.API_URL + 'mission-battelions/' + battelion.id, battelion);
  }

  deleteBattelion(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + 'mission-battelions/' + id);
  }
}
