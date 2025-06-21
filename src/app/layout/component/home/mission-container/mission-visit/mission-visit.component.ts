import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MissionVisitService } from './mission-visit.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, FileUpload, FileUploadEvent, FileBeforeUploadEvent } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Visit } from '../../../models/visit';
import { Battelion } from '../../../models/battelion';
import { Unit } from '../../../models/unit';
import { environment } from '../../../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-mission-visit',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule,
    InputTextModule, SelectModule, ConfirmDialogModule, ToastModule, DatePickerModule,
    FileUploadModule, FileUpload, NgxSpinnerModule],
  providers: [ConfirmationService, MessageService, DatePipe],
  templateUrl: './mission-visit.component.html',
  styleUrl: './mission-visit.component.scss'
})
export class MissionVisitComponent implements OnChanges {
  @Input() missionId: string | undefined;

  visitList: Visit[] = [];
  displayDialog = false;
  isEditMode = false;
  newVisit: Visit = { id: 0 };
  visitId: number | null = null;
  battelionOptions: { id: number; name: string; label: string }[] = [];
  unitOptions: { id: string; name: string; label: string }[] = [];
  previewImage: string | null = null;
  previewDialog = false;
  uploadUrl = '';
  filePreviewUrl: string | null = null;
  previewUrl: string | null = null;
  fileUploadError: string | null = null;
  uploadedFiles: any[] = [];
  API_URL = environment.API_URL + 'upload-report';
  API_FILES = environment.API_FILES;
  safePreviewUrl: SafeResourceUrl | null = null;
  hasImage = {
    'width': '90%',
    'height': '90%'
  };
  noImage = {
    'width': '500px'
  };

  constructor(private visitService: MissionVisitService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService) {}

  ngOnInit() {
    // Initial load of battelion and unit options
    this.spinner.show();
    this.loadVisitsForMission();
    this.getBattelionOptions();
    this.getUnitOptions();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['missionId'] && this.missionId) {
      this.loadVisitsForMission();
    } else if (changes['missionId'] && !this.missionId) {
      this.visitList = [];
    }
  }

  loadVisitsForMission() {
    this.visitService.getVisitsByMissionId(this.missionId).subscribe(
      (data: Visit[]) => {
        this.spinner.hide();
        this.visitList = data;
        console.log('Visits for mission loaded:', data);
      },
      (error: any) => { console.error('Error fetching visits for mission:', error); }
    );
  }

  getBattelionOptions() {
    this.visitService.getBattelions().subscribe((battelions: Battelion[]) => {
      this.battelionOptions = battelions.map(bat => ({
        id: bat.id,
        name: bat.name,
        label: bat.name
      }));
    });
  }

  getUnitOptions() {
    this.visitService.getUnits().subscribe((units: Unit[]) => {
      this.unitOptions = units.map(unit => ({
        id: unit.id,
        name: unit.name || '',
        label: (unit.name || '') + ' (' + unit.id + ')'
      }));
    });
  }

  onAddVisit() {
    this.isEditMode = false;
    this.displayDialog = true;
    this.newVisit = { id: 0, mission_id: this.missionId };
    this.getBattelionOptions();
    this.getUnitOptions();
  }

  onEditVisit(visit: Visit) {
    this.isEditMode = true;
    this.displayDialog = true;
    // Clone and convert date/time strings to Date objects for the form
    this.newVisit = { ...visit };
    if (this.newVisit.visit_date && typeof this.newVisit.visit_date === 'string') {
      this.newVisit.visit_date = new Date(this.newVisit.visit_date);
    }
    if (this.newVisit.from_time && typeof this.newVisit.from_time === 'string') {
      // from_time is 'HH:mm:ss' => convert to Date object (today's date with that time)
      const [h, m, s] = this.newVisit.from_time.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m), Number(s || 0), 0);
      this.newVisit.from_time = d;
    }
    if (this.newVisit.to_time && typeof this.newVisit.to_time === 'string') {
      const [h, m, s] = this.newVisit.to_time.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m), Number(s || 0), 0);
      this.newVisit.to_time = d;
    }
    this.getBattelionOptions();
    this.getUnitOptions();
  }

  saveVisit() {
    // Format date to 'YYYY-MM-DD' and time to 'HH:mm:ss' before save/update
    if (this.newVisit.visit_date) {
      const dateObj = new Date(this.newVisit.visit_date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      this.newVisit.visit_date = `${year}-${month}-${day}`;
    }
    if (this.newVisit.from_time) {
      const from = new Date(this.newVisit.from_time);
      const fromHours = from.getHours().toString().padStart(2, '0');
      const fromMinutes = from.getMinutes().toString().padStart(2, '0');
      this.newVisit.from_time = `${fromHours}:${fromMinutes}:00`;
    }
    if (this.newVisit.to_time) {
      const to = new Date(this.newVisit.to_time);
      const toHours = to.getHours().toString().padStart(2, '0');
      const toMinutes = to.getMinutes().toString().padStart(2, '0');
      this.newVisit.to_time = `${toHours}:${toMinutes}:00`;
    }
    if (this.isEditMode) {
      this.visitService.updateVisit(this.newVisit).subscribe(
        () => {
          this.loadVisitsForMission();
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الزيارة بنجاح' });
        },
        (error: any) => { console.error('Error updating visit:', error); }
      );
    } else {
      this.visitService.addVisit({ ...this.newVisit, mission_id: this.missionId }).subscribe(
        () => {
          this.loadVisitsForMission();
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الزيارة بنجاح' });
        },
        (error: any) => { console.error('Error adding visit:', error); }
      );
    }
  }

  confirmDeleteVisit(visit: Visit) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد حذف هذه الزيارة؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-info-circle',
      rejectLabel: 'إلغاء',
      rejectButtonProps: { label: 'إلغاء', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'حذف', severity: 'danger' },
      accept: () => { this.onDeleteVisit(visit.id); },
      reject: () => {}
    });
  }

  onDeleteVisit(id: number) {
    this.visitService.deleteVisit(id).subscribe(
      () => {
        this.loadVisitsForMission();
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الزيارة' });
      },
      (error: any) => { console.error('Error deleting visit:', error); }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }

  // onPreviewImage(reportPath: string) {
  //   this.previewImage = this.API_FILES + reportPath;
  //   this.previewDialog = true;
  // }

  previewReport(reportPath: string, id: number) {
    this.previewUrl = this.API_FILES + reportPath;
    this.visitId = id;
    if (this.isPdf(reportPath)) {
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
    } else {
      this.safePreviewUrl = null; // Clear if not a PDF
    }
    this.uploadedFiles = []; // Clear previous uploaded files
    this.filePreviewUrl = null; // Clear any previous preview
    this.previewDialog = true;
  }

  onFileSelect(event: any) {
    this.fileUploadError = null;
    console.log('File select event:', event.files);
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError = 'الملف يجب أن يكون صورة أو PDF فقط';
        this.filePreviewUrl = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isImage(path: string | null): boolean {
    return !!path && (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif'));
  }

  isPdf(path: string | null): boolean {
    return !!path && path.endsWith('.pdf');
  }

  getUnitName(unitId: string | number | undefined): string {
    if (!unitId) return '';
    const unit = this.unitOptions.find(u => u.id == unitId);
    return unit ? unit.label : '';
  }

  onFileUpload(event: any) {
    console.log('File upload event:', event.files);
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError = 'الملف يجب أن يكون صورة أو PDF فقط';
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      this.visitService.uploadVisitReport(formData).subscribe(
        (res: any) => {
          // Assume backend returns the file path or URL
          this.newVisit.report_path = res.filePath || res.path;
          this.fileUploadError = null;
          // Optionally preview
          if (allowedTypes.slice(0, 4).includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.filePreviewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
          } else {
            this.filePreviewUrl = null;
          }
        },
        () => {
          this.fileUploadError = 'فشل رفع الملف';
        }
      );
    }
  }

  onUpload(event: FileUploadEvent) {
    console.log('File upload event:', event);
    this.previewDialog = false; // Close preview dialog if open
    this.filePreviewUrl = null; // Clear any previous preview
    // this.uploadedFiles.length = 0; // Clear previous uploaded files
    this.fileUploadError = null; // Reset error message
    this.loadVisitsForMission(); // Reload visits to reflect the new upload
    this.messageService.add({ severity: 'info', summary: 'تم', detail: 'تم رفع الملف بنجاح' });
    // Optionally, set the uploaded file path to newVisit.report_path if your backend returns it
    if (event.files) {
      this.uploadedFiles.push(...event.files);
      console.log('Uploaded files:', this.uploadedFiles);
      // this.newVisit.report_path = event.originalEvent.body.filePath;
      // this.previewUrl = event.originalEvent.body.filePath;
    }
  }

  onBeforeUpload(event: FileBeforeUploadEvent) {
    if (!this.missionId) {
      console.error('Mission ID is not set, cannot upload file');
    } else {
      console.log('Before send event:', this.missionId);
      event.formData.append('mission_id', this.missionId.toString());
      event.formData.append('visit_id', this.visitId ? this.visitId.toString() : '');
    }
  }

  deleteVisitFile() {
    if (!this.visitId) return;
    this.visitService.deleteVisitFile(this.visitId).subscribe(
      () => {
        this.previewUrl = null;
        this.safePreviewUrl = null;
        this.filePreviewUrl = null;
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الملف بنجاح' });
        this.loadVisitsForMission();
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف الملف' });
        console.error('Error deleting file:', error);
      }
    );
  }
}
