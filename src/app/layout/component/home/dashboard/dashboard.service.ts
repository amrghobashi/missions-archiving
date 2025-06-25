import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PurposeStats, Stats } from '../../models/dashboard';
import { Visit } from '../../models/visit';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URL = environment.API_URL ;
  selectedUnit: Subject<{'code': string, 'name': string, 'parent': string}> = new Subject<{'code': string, 'name': string, 'parent': string}>();
  selectedUnitByDate: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  getBatUnitVisit(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'bat-unit');
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.API_URL + 'dashboard-stats');
  }

  getPurposeStats(): Observable<PurposeStats[]> {
    return this.http.get<PurposeStats[]>(this.API_URL + 'missions-by-purpose');
  }

  getZoneStats(): Observable<PurposeStats[]> {
    return this.http.get<PurposeStats[]>(this.API_URL + 'missions-by-zone');
  }

  getUnitVisits(id: string): Observable<PurposeStats[]> {
    return this.http.get<PurposeStats[]>(this.API_URL + 'visits-by-quarter' + (id ? '?unit_id=' + id : ''));
  }
  
  getVisitsByUnitId(id: string | undefined, date: string | undefined): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.API_URL + 'mission-visits-by-quarter' + (id ? '?unit_id=' + id : '') + (date ? '&date=' + date : ''))
  }
}
