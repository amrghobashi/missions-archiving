import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Mission } from '../../../models/mission';
import { Zone } from '../../../models/zone';
import { Purpose } from '../../../models/purpose';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private API_URL = environment.API_URL;
  // mission: Mission | undefined;
  // selectedMission = new BehaviorSubject<Mission | undefined>(this.mission);
  selectedMission: Subject<Mission> = new Subject<Mission>();

  constructor(private http: HttpClient) { }

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.API_URL + 'missions');
  }

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.API_URL + 'zones');
  }

  getPurposes(): Observable<Purpose[]> {
    return this.http.get<Purpose[]>(this.API_URL + 'purposes');
  }

  addMission(mission: Mission): Observable<Mission> {
    return this.http.post<Mission>(this.API_URL + 'missions', mission);
  }
}
