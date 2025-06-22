export interface Staff {
  id: number;
  arabic_name?: string;
  english_name?: string;
  job_title?: string;
  staff_type_id?: number;
  staff_type_name?: string;
  phase_id?: number;
  phase_name?: string;
  staff_desc?: string;
  active?: number;
  start_date?: string | Date;
  end_date?: string | Date;
  mission_id?: number;
}

export interface StaffType {
  id: number;
  name: string;
}