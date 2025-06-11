import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Mission } from '../../../models/mission';
import { MissionService } from './mission.service';
import { Subscription } from 'rxjs';
import { Zone } from '../../../models/zone';
import { Purpose } from '../../../models/purpose';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, SelectModule, DatePickerModule,
    InputTextModule
  ],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {
  constructor(private missionService: MissionService ) { }

  ngOnInit() {
    this.getMissions();
    this.getZones();
    this.getPurposes();
  }

  subscription: Subscription = new Subscription;
  
  missions: Mission[] = [];

  selectedMission: Mission[] = [];
  displayAddDialog = false;
  rangeDates: Date[] = [];
  newMission: Mission = {
    id: 0,
    zone_id: 0,
    start_date: '',
    end_date: '',
    purpose_id: 0,
    destination_city: ''
  };

  zoneOptions: Zone[] = [];
  purposeOptions: Purpose[] = [];

  getMissions() {
    this.subscription = this.missionService.getMissions().subscribe(
      (data: any) => {
        this.missions = data;
        console.log('Missions fetched successfully:', this.missions);
      },
      (error: any) => {
        console.error('Error fetching missions:', error);
      }
    );
  }

  getZones() {
    this.subscription = this.missionService.getZones().subscribe(
      (data: any) => {
        this.zoneOptions = data;
        console.log('Zones fetched successfully:', this.zoneOptions);
      },
      (error: any) => {
        console.error('Error fetching zones:', error);
      }
    );
  }

  getPurposes() {
    this.subscription = this.missionService.getPurposes().subscribe(
      (data: any) => {
        this.purposeOptions = data;
        console.log('Purposes fetched successfully:', this.purposeOptions);
      },
      (error: any) => {
        console.error('Error fetching purposes:', error);
      }
    );
  }

  onPickDate(event: any) {
    const startDate = this.rangeDates?.[0];
    const endDate = this.rangeDates?.[1];

    this.newMission.start_date = startDate ? startDate.toISOString().split('T')[0] : '';
    this.newMission.end_date = endDate ? endDate.toISOString().split('T')[0] : '';

    console.log('Start Date:', this.newMission.start_date);
    console.log('End Date:', endDate);
  }

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
      purpose_id: 0,
      destination_city: ''
    };
  }

  saveNewMission() {
    this.subscription = this.missionService.addMission(this.newMission).subscribe(
      (data: any) => {
        console.log('New mission added:', data);
        this.getMissions();
        this.displayAddDialog = false;
      }
    );
  }

  cancelAddMission() {
    this.displayAddDialog = false;
  }
}
