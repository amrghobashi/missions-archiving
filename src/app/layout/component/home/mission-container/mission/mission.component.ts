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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, SelectModule, DatePickerModule,
    InputTextModule, ConfirmDialogModule, ToastModule, NgxSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {
  constructor(private missionService: MissionService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getMissions();
    this.getZones();
    this.getPurposes();
  }

  subscription: Subscription = new Subscription;
  
  missions: Mission[] = [];

  selectedMission!: Mission;
  displayAddDialog = false;
  rangeDates: Date[] = [];
  newMission: Mission = {
    id: '',
    zone_id: 0,
    start_date: '',
    end_date: '',
    purpose_id: 0,
    destination_city: ''
  };
  emptyMission!: Mission;
  zoneOptions: Zone[] = [];
  purposeOptions: Purpose[] = [];

  isEditMode = false;

  getMissions() {
    this.spinner.show();
    this.subscription = this.missionService.getMissions().subscribe(
      (data: any) => {
        this.missions = data;
        this.spinner.hide();
        console.log('Missions fetched successfully:', this.missions);
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error fetching missions:', error);
      }
    );
  }

  getZones() {
    this.spinner.show();
    this.subscription = this.missionService.getZones().subscribe(
      (data: any) => {
        this.zoneOptions = data;
        this.spinner.hide();
        console.log('Zones fetched successfully:', this.zoneOptions);
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error fetching zones:', error);
      }
    );
  }

  getPurposes() {
    this.spinner.show();
    this.subscription = this.missionService.getPurposes().subscribe(
      (data: any) => {
        this.purposeOptions = data;
        this.spinner.hide();
        console.log('Purposes fetched successfully:', this.purposeOptions);
      },
      (error: any) => {
        this.spinner.hide();
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
    console.log('Selected mission:', event.id);
    this.selectedMission = event;
    this.missionService.selectedMission.next(event);
  }

  onUnselectMission() {
    // console.log('Unselected mission:', event.id);
    this.selectedMission = this.emptyMission;
    this.missionService.selectedMission.next(this.emptyMission);
  }

  onEditMission(mission: Mission) {
    this.isEditMode = true;
    this.displayAddDialog = true;
    // Deep copy to avoid mutating the table row directly
    this.newMission = { ...mission };
    // Set date range for datepicker
    if (mission.start_date && mission.end_date) {
      this.rangeDates = [new Date(mission.start_date), new Date(mission.end_date)];
    } else {
      this.rangeDates = [];
    }
  }

  onAddMission() {
    this.isEditMode = false;
    this.displayAddDialog = true;
    this.newMission = {
      id: '',
      zone_id: 0,
      start_date: '',
      end_date: '',
      purpose_id: 0,
      destination_city: ''
    };
    this.rangeDates = [];
  }

  saveNewMission() {
    if (this.isEditMode) {
      this.subscription = this.missionService.updateMission(this.newMission).subscribe(
        (data: any) => {
          console.log('Mission updated:', data);
          this.getMissions();
          this.displayAddDialog = false;
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل المهمة بنجاح' });
        },
        (error: any) => {
          console.error('Error updating mission:', error);
        }
      );
    } else {
      this.subscription = this.missionService.addMission(this.newMission).subscribe(
        (data: any) => {
          console.log('New mission added:', data);
          this.getMissions();
          this.displayAddDialog = false;
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة المهمة بنجاح' });
        }
      );
    }
  }

  confirmDeleteMission(mission: Mission) {
    this.confirmationService.confirm({
            // target: event.target as EventTarget,
            message: 'هل أنت متأكد أنك تريد حذف هذه المهمة؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-info-circle',
            rejectLabel: 'إلغاء',
            rejectButtonProps: {
                label: 'إلغاء',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'حذف',
                severity: 'danger',
            },

            accept: () => {
                this.onDeleteMission(mission.id);
            },
            reject: () => {
            },
        });
  }

  onDeleteMission(id: string) {
    this.subscription = this.missionService.deleteMission(id).subscribe(
      () => {
        console.log('Mission deleted:', id);
        this.missions = this.missions.filter(m => m.id !== id);
        this.selectedMission = this.emptyMission;
        this.missionService.selectedMission.next(this.emptyMission);
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف المهمة' });
      },
      (error: any) => {
        console.error('Error deleting mission:', error);
      }
    );
  }

  cancelAddMission() {
    this.displayAddDialog = false;
  }
}
