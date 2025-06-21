export interface Unit {
  id: string;
  name?: string;
  unit_lat?: string;
  unit_long?: string;
  secret_no?: string;
  battelion_id?: number;
  battelion_name?: string;
  unit_type_id?: number;
  unit_type_name?: string;
  phase_id?: number;
}

export interface UnitType {
  id: number;
  name: string;
}