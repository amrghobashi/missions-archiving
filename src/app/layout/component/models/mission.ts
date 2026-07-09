export interface Mission {
  id: string;
  zone_id: number;
  zone_name?: string;
  start_date: string | Date;
  end_date: string | Date;
  purpose_id: number;
  purpose_name?: string;
  destination_city: string;
  report_path?: string;
  ojt_report_path?: string;
  [key: string]: string | number | Date | undefined;
}