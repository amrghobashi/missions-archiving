export interface Visit {
  id: number;
  visit_seq?: string;
  battelion_id?: number;
  battelion_name?: string;
  unit_id?: number;
  unit_name?: string;
  mission_id?: string;
  visit_date?: string | Date;
  from_time?: string | Date;
  to_time?: string | Date;
  report_path?: string;
}