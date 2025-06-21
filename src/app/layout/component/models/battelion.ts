export interface MissionBattelion {
  id: number;
  mission_id?: string;
  battelion_id?: number;
  battelion_name?: string;
}

export interface Battelion {
  id: number;
  name: string;
  bat_lat: number;
  bat_long: number;
  zone_id: number;
  destination_city: string;
}