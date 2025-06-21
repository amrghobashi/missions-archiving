import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MissionStaffService } from './mission-staff.service';
import { Staff } from '../../../models/staff';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-mission-staff',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, InputTextModule, ConfirmDialogModule,
    ToastModule, MultiSelectModule, NgxSpinnerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './mission-staff.component.html',
  styleUrl: './mission-staff.component.scss'
})
export class MissionStaffComponent implements OnChanges {
  @Input() missionId: string | undefined;
  @ViewChild('multiSelectRef') multiSelectRef!: MultiSelect;
  
  constructor(private missionStaffService: MissionStaffService, private confirmationService: ConfirmationService, private messageService: MessageService, private spinner: NgxSpinnerService) {}

  staffList: Staff[] = [];
  displayDialog = false;
  isEditMode = false;
  newStaff: Staff = { id: 0, arabic_name: '' };
  staffOptions: Staff[] = [];
  newStaffIds: number[] = [];
  groupedStaffOptions: any[] = [];
  selectedStaffs!: number[];

  ngOnInit() {
    this.spinner.show();
    this.getStaffOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['missionId'] && this.missionId) {
      this.loadStaffForMission(this.missionId);
    } else if (changes['missionId'] && !this.missionId) {
      this.staffList = [];
    }
  }

  getStaff() {
    // Only used for CRUD actions, always reload by missionId
    if (this.missionId) {
      this.spinner.show();
      this.loadStaffForMission(this.missionId);
    } else {
      this.staffList = [];
    }
  }

  getStaffOptions(id: string | undefined = undefined) {
    this.spinner.show();
    this.missionStaffService.getStaff(id).subscribe(
      (data) => {
        this.groupedStaffOptions = data;
        this.multiSelectRef.show();
        this.spinner.hide();
      },
      (error) => { this.spinner.hide(); console.error('Error fetching staff options:', error); }
    );
  }

  onStaffChange(event: any) {
    // Handle staff selection change
    this.selectedStaffs = event.value;
    console.log('Selected staff:', this.selectedStaffs);
  }

  onAddStaff() {
    this.getStaffOptions(this.missionId); // Load staff options for dropdown
    this.selectedStaffs = [];
    this.displayDialog = true;
  }

  saveStaff() {
    console.log('Saving staff:', this.selectedStaffs);
    this.missionStaffService.addStaff(this.selectedStaffs, this.missionId).subscribe(
      (data) => {
        this.getStaff();
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة عدد ' + this.selectedStaffs.length + ' موظف بنجاح' });
      },
      (error) => { console.error('Error adding staff:', error); }
    );
  }

  confirmDeleteStaff(staff: Staff) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد حذف هذا الموظف؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-info-circle',
      rejectLabel: 'إلغاء',
      rejectButtonProps: { label: 'إلغاء', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'حذف', severity: 'danger' },
      accept: () => { this.onDeleteStaff(staff.id); },
      reject: () => {}
    });
  }

  onDeleteStaff(id: number) {
    this.missionStaffService.deleteStaff(id).subscribe(
      () => {
        this.getStaff();
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الموظف' });
      },
      (error) => { console.error('Error deleting staff:', error); }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }

  // Add this method to be called from the parent (mission component)
  loadStaffForMission(missionId: string) {
    this.spinner.show();
    this.missionStaffService.getStaffByMissionId(missionId).subscribe(
      (data) => { this.staffList = data; this.spinner.hide(); },
      (error) => { this.spinner.hide(); console.error('Error fetching staff for mission:', error); }
    );
  }
}
