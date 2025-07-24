export interface Mission {
  id: string;
  zone_id: number;
  zone_name?: string;
  start_date: string;
  end_date: string;
  purpose_id: number;
  purpose_name?: string;
  destination_city: string;
  report_path?: string;
}