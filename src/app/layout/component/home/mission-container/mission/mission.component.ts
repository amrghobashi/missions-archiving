import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { FileUploadModule, FileUpload, FileUploadEvent, FileBeforeUploadEvent } from 'primeng/fileupload';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, SelectModule, DatePickerModule,
    InputTextModule, ConfirmDialogModule, ToastModule, NgxSpinnerModule,
    FileUploadModule, FileUpload, CommonModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {
  constructor(private missionService: MissionService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getMissions();
    this.getZones();
    this.getPurposes();

    this.cols = [
      { field: 'staff_count', header: 'عدد FSR' },
      { field: 'visited_units', header: 'عدد المنظومات التي تم المرور عليها' },
      { field: 'visited_battelions', header: 'الكتيبة' },
      { field: 'purpose_name', header: 'الغرض' },
      { field: 'period', header: 'عدد الأيام' },
      { field: 'end_date', header: 'تاريخ النهاية' },
      { field: 'start_date', header: 'تاريخ البداية' },
        // { field: 'zone_id', header: 'zone_id' },
    ];

    this.exportColumns = this.cols.map(col => ({
        title: col.customExportHeader || col.header,
        dataKey: col.field
    }));
  }

  cols!: Column[];
  exportColumns!: ExportColumn[];

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
  first = 0;
  rows = 10;
  previewMissionReportDialog = false;
  missionPreviewUrl: string | null = null;
  safeMissionPreviewUrl: SafeResourceUrl | null = null;
  API_MISSION_REPORT_URL = environment.API_URL + 'upload-mission-report'; // Adjust endpoint as needed
  API_MISSION_OJT_REPORT_URL = environment.API_URL + 'upload-ojt-report'; // Adjust endpoint as needed
  API_MISSION_FILES = environment.API_FILES;
  API_MISSION_OJT_REPORT_FILES = environment.API_FILES;
  hasImage = { 'width': '90%', 'height': '90%' };
  noImage = { 'width': '500px' };
  selectedMissionForReport: Mission | null = null;

  // OJT Report dialog properties
  previewOjtReportDialog = false;
  ojtPreviewUrl: string | null = null;
  safeOjtPreviewUrl: any = null;
  selectedMissionForOjtReport: Mission | null = null;

  
  // Helper to parse dd/MM/yyyy to Date
  parseDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(+year, +month - 1, +day);
  }

  getMissions() {
    this.spinner.show();
    this.subscription = this.missionService.getMissions().subscribe(
      (data: any) => {
        this.missions = data.map((mission: Mission) => ({
          ...mission,
          start_date: typeof mission.start_date === 'string' && mission.start_date.includes('/') ? this.parseDDMMYYYY(mission.start_date) : mission.start_date,
          end_date: typeof mission.end_date === 'string' && mission.end_date.includes('/') ? this.parseDDMMYYYY(mission.end_date) : mission.end_date
        }));
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

    if (startDate) {
      const year = startDate.getFullYear();
      const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
      const day = startDate.getDate().toString().padStart(2, '0');
      this.newMission.start_date = `${year}-${month}-${day}`;
    } else {
      this.newMission.start_date = '';
    }

    if (endDate) {
      const year = endDate.getFullYear();
      const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
      const day = endDate.getDate().toString().padStart(2, '0');
      this.newMission.end_date = `${year}-${month}-${day}`;
    } else {
      this.newMission.end_date = '';
    }

    console.log('Start Date:', this.newMission.start_date);
    console.log('End Date:', this.newMission.end_date);
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
      let startDate: Date;
      let endDate: Date;
      if (typeof mission.start_date === 'string' && mission.start_date.includes('/')) {
        startDate = this.parseDDMMYYYY(mission.start_date);
      } else {
        startDate = new Date(mission.start_date);
      }
      if (typeof mission.end_date === 'string' && mission.end_date.includes('/')) {
        endDate = this.parseDDMMYYYY(mission.end_date);
      } else {
        endDate = new Date(mission.end_date);
      }
      this.rangeDates = [startDate, endDate];
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
    // Always format dates before sending to backend
    if (this.newMission.start_date instanceof Date) {
      const d = this.newMission.start_date;
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      this.newMission.start_date = `${year}-${month}-${day}`;
    }
    if (this.newMission.end_date instanceof Date) {
      const d = this.newMission.end_date;
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      this.newMission.end_date = `${year}-${month}-${day}`;
    }

    if (this.isEditMode) {
      this.subscription = this.missionService.updateMission(this.newMission).subscribe(
        (data: any) => {
          console.log('Mission updated:', data);
          this.getMissions();
          this.displayAddDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Mission updated successfully' });
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
          this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Mission added successfully' });
        }
      );
    }
  }

  confirmDeleteMission(mission: Mission) {
    this.confirmationService.confirm({
            // target: event.target as EventTarget,
            message: 'Are you sure you want to delete this mission?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Delete',
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
        this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Mission deleted successfully' });
      },
      (error: any) => {
        console.error('Error deleting mission:', error);
      }
    );
  }

  cancelAddMission() {
    this.displayAddDialog = false;
  }

  previewMissionReport(mission: Mission) {
    this.selectedMissionForReport = mission;
    this.missionPreviewUrl = mission.report_path ? this.API_MISSION_FILES + mission.report_path : null;
    this.previewMissionReportDialog = true;
    if (this.missionPreviewUrl && this.isPdf(this.missionPreviewUrl)) {
      this.safeMissionPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.missionPreviewUrl);
    } else {
      this.safeMissionPreviewUrl = null;
    }
  }

  isImage(path: string | null): boolean {
    return !!path && (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif'));
  }

  // OJT Report dialog helpers
  isOjtImage(path: string | null): boolean {
    return !!path && (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif'));
  }

  isPdf(path: string | null): boolean {
    return !!path && path.endsWith('.pdf');
  }

  isOjtPdf(path: string | null): boolean {
    return !!path && path.endsWith('.pdf');
  }

  previewOjtReport(mission: Mission) {
    console.log('Previewing OJT report for mission:', mission);
    this.selectedMissionForOjtReport = mission;
    this.ojtPreviewUrl = mission.ojt_report_path ? this.API_MISSION_OJT_REPORT_FILES + mission.ojt_report_path : null;
    this.previewOjtReportDialog = true;
    if (this.ojtPreviewUrl && this.isOjtPdf(this.ojtPreviewUrl)) {
      this.safeOjtPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ojtPreviewUrl);
    } else {
      this.safeOjtPreviewUrl = null;
    }
  }

  onBeforeMissionReportUpload(event: any) {
    if (this.selectedMissionForReport) {
      event.formData.append('mission_id', this.selectedMissionForReport.id);
    }
  }

  onMissionReportUpload(event: any) {
    this.previewMissionReportDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Report uploaded successfully' });
    this.getMissions();
  }

  onBeforeOjtReportUpload(event: any) {
    if (this.selectedMissionForOjtReport) {
      event.formData.append('mission_id', this.selectedMissionForOjtReport.id);
    }
  }

  onOjtReportUpload(event: any) {
    this.previewOjtReportDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OJT report uploaded successfully' });
    this.getMissions(); // Reload missions to reflect the new OJT report
  }

  private toYMD(date: string | Date): string {
    let d: Date;
    if (Object.prototype.toString.call(date) === '[object Date]') {
      d = date as Date;
    } else if (typeof date === 'string' && date.includes('T')) {
      d = new Date(date);
    } else {
      // Already in 'YYYY-MM-DD' or empty
      return date as string;
    }
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add this method to format dates before export
  exportExcel() {
    const formattedData = this.missions.map(mission => {
        const formatted: any = {};
        
        this.cols.forEach(col => {
            if (col.field === 'start_date' || col.field === 'end_date') {
                if (mission[col.field]) {
                    const date = new Date(mission[col.field]);
                    formatted[col.field] = date.getDate().toString().padStart(2, '0') + '/' +
                        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        date.getFullYear();
                } else {
                    formatted[col.field] = '';
                }
            } else {
                formatted[col.field] = mission[col.field];
            }
        });
        
        return formatted;
    });

    // const formattedData = this.missions.map(mission => {
    //     const formatted = { ...mission };
        
    //     // Format start_date
    //     if (formatted.start_date) {
    //         const date = new Date(formatted.start_date);
    //         formatted.start_date = date.getDate().toString().padStart(2, '0') + '/' +
    //             (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
    //             date.getFullYear();
    //     }
        
    //     // Format end_date
    //     if (formatted.end_date) {
    //         const date = new Date(formatted.end_date);
    //         formatted.end_date = date.getDate().toString().padStart(2, '0') + '/' +
    //             (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
    //             date.getFullYear();
    //     }
        
    //     return formatted;
    // });

    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        
        // Rename the headers to use the customExportHeader or header from cols
        const headers = this.cols.map(col => col.customExportHeader || col.header);
        xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        // Align all cells to the right
        const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = xlsx.utils.encode_cell({ r: R, c: C });
                if (!worksheet[cell_address]) continue;
                if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
                worksheet[cell_address].s.alignment = { horizontal: 'right' };
            }
        }

        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "missions");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    link.click();
}
}
