import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../../models/unit';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private API_URL = environment.API_URL + 'units';

  constructor(private http: HttpClient) { }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.API_URL);
  }

  addUnit(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this.API_URL, unit);
  }

  updateUnit(unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(`${this.API_URL}/${unit.id}`, unit);
  }

  deleteUnit(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  getUnitTypes() {
    return this.http.get<{id: number, name: string}[]>(environment.API_URL + 'unit-types');
  }

  getBattelions() {
    return this.http.get<{id: number, name: string}[]>(environment.API_URL + 'battelions');
  }

  getPhases() {
    return this.http.get<{id: number, name: string}[]>(environment.API_URL + 'phases');
  }
}
