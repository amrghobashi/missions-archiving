import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';

interface Mission {
  id: number;
  zone_id: number;
  start_date: string;
  end_date: string;
  purbose_id: number;
  destination_city: string;
}

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, SelectModule, DatePickerModule],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {
  missions: Mission[] = [
    { id: 1, zone_id: 101, start_date: '2025-06-01', end_date: '2025-06-05', purbose_id: 1, destination_city: 'Riyadh' },
    { id: 2, zone_id: 102, start_date: '2025-06-10', end_date: '2025-06-12', purbose_id: 2, destination_city: 'Jeddah' }
  ];

  selectedMission: Mission[] = [];
  displayAddDialog = false;
  rangeDates: Date[] | undefined;
  newMission: Mission = {
    id: 0,
    zone_id: 0,
    start_date: '',
    end_date: '',
    purbose_id: 0,
    destination_city: ''
  };

  zoneOptions = [
    { label: 'North Zone', value: 101 },
    { label: 'South Zone', value: 102 },
    { label: 'East Zone', value: 103 },
    { label: 'West Zone', value: 104 }
  ];
  purposeOptions = [
    { label: 'Training', value: 1 },
    { label: 'Operation', value: 2 },
    { label: 'Maintenance', value: 3 },
    { label: 'Other', value: 4 }
  ];

  onSelectMission(event: any) {
    console.log('Selected mission:', event);
    this.selectedMission = event;
  }

  onEditMission(mission: Mission) {
    // Implement edit logic here
    alert('Edit mission: ' + mission.id);
  }

  onDeleteMission(mission: Mission) {
    // Implement delete logic here
    this.missions = this.missions.filter(m => m.id !== mission.id);
  }

  onAddMission() {
    this.displayAddDialog = true;
    this.newMission = {
      id: 0,
      zone_id: 0,
      start_date: '',
      end_date: '',
      purbose_id: 0,
      destination_city: ''
    };
  }

  saveNewMission() {
    const newId = this.missions.length ? Math.max(...this.missions.map(m => m.id)) + 1 : 1;
    this.missions = [
      ...this.missions,
      { ...this.newMission, id: newId }
    ];
    this.displayAddDialog = false;
  }

  cancelAddMission() {
    this.displayAddDialog = false;
  }
}
