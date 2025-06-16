import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Car } from '../../../models/car';

@Injectable({
  providedIn: 'root'
})
export class MissionCarService {
  private API_URL = environment.API_URL; // Adjust to your real API base

  constructor(private http: HttpClient) { }

  getCarsByMissionId(missionId: string): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'mission-cars?mission_id=' + missionId);
  }

  addCar(car: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'mission-cars', car);
  }

  updateCar(car: any): Observable<any> {
    return this.http.put<any>(this.API_URL + 'mission-cars/' + car.id, car);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + 'mission-cars/' + id);
  }

  getCars(missionId?: string): Observable<Car[]> {
    return this.http.get<Car[]>(this.API_URL + 'car-list' + (missionId ? '?mission_id=' + missionId : ''));
  }
}
