export interface MissionCar {
  id: number;
  mission_id?: string;
  car_id?: string;
  car_name?: string;
  km_before?: number;
  km_after?: number;
  distance?: number;
}

export interface Car {
  id: number;
  name: string;
}