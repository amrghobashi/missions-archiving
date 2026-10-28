import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Purpose } from '../../layout/component/models/purpose';
import { Zone } from '../../layout/component/models/zone';
import { UnitType } from '../../layout/component/models/unit-type';
import { Phase } from '../../layout/component/models/phase';
import { Car } from '../../layout/component/models/car';

export interface LookupItem {
  id: any;
  name: string;
  [key: string]: any;
}

export type LookupType = 'purposes' | 'zones' | 'unit-types' | 'phases' | 'cars';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private base = environment.API_URL;

  constructor(private http: HttpClient) {}

  // ── Generic Operations ──
  getItems(type: LookupType): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.base}${type}`);
  }

  getItem(type: LookupType, id: any): Observable<LookupItem> {
    return this.http.get<LookupItem>(`${this.base}${type}/${id}`);
  }

  addItem(type: LookupType, payload: any): Observable<LookupItem> {
    const body = typeof payload === 'string' ? { name: payload } : payload;
    return this.http.post<LookupItem>(`${this.base}${type}`, body);
  }

  updateItem(type: LookupType, id: any, payload: any): Observable<LookupItem> {
    const body = typeof payload === 'string' ? { name: payload } : payload;
    return this.http.put<LookupItem>(`${this.base}${type}/${id}`, body);
  }

  deleteItem(type: LookupType, id: any): Observable<any> {
    return this.http.delete<any>(`${this.base}${type}/${id}`);
  }

  // ── Purposes ──
  getPurposes(): Observable<Purpose[]> {
    return this.http.get<Purpose[]>(`${this.base}purposes`);
  }
  addPurpose(name: string): Observable<Purpose> {
    return this.http.post<Purpose>(`${this.base}purposes`, { name });
  }
  updatePurpose(id: number, name: string): Observable<Purpose> {
    return this.http.put<Purpose>(`${this.base}purposes/${id}`, { name });
  }
  deletePurpose(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}purposes/${id}`);
  }

  // ── Zones ──
  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.base}zones`);
  }
  addZone(name: string): Observable<Zone> {
    return this.http.post<Zone>(`${this.base}zones`, { name });
  }
  updateZone(id: number, name: string): Observable<Zone> {
    return this.http.put<Zone>(`${this.base}zones/${id}`, { name });
  }
  deleteZone(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}zones/${id}`);
  }

  // ── Unit Types ──
  getUnitTypes(): Observable<UnitType[]> {
    return this.http.get<UnitType[]>(`${this.base}unit-types`);
  }
  addUnitType(name: string): Observable<UnitType> {
    return this.http.post<UnitType>(`${this.base}unit-types`, { name });
  }
  updateUnitType(id: number, name: string): Observable<UnitType> {
    return this.http.put<UnitType>(`${this.base}unit-types/${id}`, { name });
  }
  deleteUnitType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}unit-types/${id}`);
  }

  // ── Phases ──
  getPhases(): Observable<Phase[]> {
    return this.http.get<Phase[]>(`${this.base}phases`);
  }
  addPhase(name: string): Observable<Phase> {
    return this.http.post<Phase>(`${this.base}phases`, { name });
  }
  updatePhase(id: number, name: string): Observable<Phase> {
    return this.http.put<Phase>(`${this.base}phases/${id}`, { name });
  }
  deletePhase(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}phases/${id}`);
  }

  // ── Cars ──
  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.base}cars`);
  }
  addCar(car: { id: string; name: string }): Observable<Car> {
    return this.http.post<Car>(`${this.base}cars`, car);
  }
  updateCar(id: string, car: { id: string; name: string }): Observable<Car> {
    return this.http.put<Car>(`${this.base}cars/${id}`, car);
  }
  deleteCar(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}cars/${id}`);
  }
}
