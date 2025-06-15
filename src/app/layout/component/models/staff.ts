export interface Staff {
  id: number;
  arabic_name?: string;
  english_name?: string;
  job_title?: string;
  staff_type_id?: number;
  staff_type_name?: string;
  staff_desc?: string;
  mission_id?: number;
}

export interface StaffType {
  id: number;
  name: string;
}