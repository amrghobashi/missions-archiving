import { Component } from '@angular/core';
import { Staff } from '../../models/staff';
import { StaffService } from './staff.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ToggleButton, ToggleButtonChangeEvent } from 'primeng/togglebutton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, InputTextModule,
    ConfirmDialogModule, ToastModule, NgxSpinnerModule, ToggleButton, SelectModule,
    DatePickerModule, IconFieldModule, InputIconModule],
  providers: [ConfirmationService, MessageService, DatePipe ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent {
  staffList: Staff[] = [];
  selectedStaff!: Staff;
  displayDialog = false;
  isEditMode = false;
  newStaff: Staff = this.emptyStaff();
  isLoading = false;
  checked = true;
  staffTypes: {id: number, name: string}[] = [];
  phases: {id: number, name: string}[] = [];
  first = 0;
  rows = 10;
  constructor(private staffService: StaffService, private confirmationService: ConfirmationService, private messageService: MessageService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.loadStaff();
    this.loadStaffTypes();
    this.loadPhases();
  }

  loadPhases() {
    this.staffService.getPhases().subscribe(
      (phases) => { this.phases = phases; },
      (error) => { this.phases = []; }
    );
  }

  loadStaffTypes() {
    this.staffService.getStaffTypes().subscribe(
      (types) => { this.staffTypes = types; },
      (error) => { this.staffTypes = []; }
    );
  }

  emptyStaff(): Staff {
    return {
      id: 0,
      arabic_name: '',
      english_name: '',
      job_title: '',
      staff_type_id: 0,
      phase_id: 0,
      staff_desc: '',
      active: 1,
      start_date: '',
      end_date: ''
    };
  }

  loadStaff() {
    this.spinner.show();
    this.staffService.getStaff().subscribe(
      (data: Staff[]) => {
        this.staffList = data;
        console.log('Staff loaded:', this.staffList);
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل بيانات الطاقم' });
      }
    );
  }

  onAddStaff() {
    this.isEditMode = false;
    this.displayDialog = true;
    this.newStaff = this.emptyStaff();
  }

  onEditStaff(staff: Staff) {
    this.isEditMode = true;
    this.displayDialog = true;
    this.newStaff = { ...staff };
    if (this.newStaff.start_date && typeof this.newStaff.start_date === 'string') {
      this.newStaff.start_date = new Date(this.newStaff.start_date);
    }
    if (this.newStaff.end_date && typeof this.newStaff.end_date === 'string') {
      this.newStaff.end_date = new Date(this.newStaff.end_date);
    }
  }

  saveStaff() {
    // Format date to 'YYYY-MM-DD' before save/update
    if (this.newStaff.start_date) {
      const dateObj = new Date(this.newStaff.start_date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      this.newStaff.start_date = `${year}-${month}-${day}`;
    }
    if (this.newStaff.end_date) {
      const dateObj = new Date(this.newStaff.end_date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      this.newStaff.end_date = `${year}-${month}-${day}`;
    }
    if (this.isEditMode) {
      this.staffService.updateStaff(this.newStaff).subscribe(
        () => {
          this.displayDialog = false;
          // this.spinner.show();
          this.loadStaff();
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل بيانات الموظف بنجاح' });
          // this.spinner.hide();
        },
        (error: any) => {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تعديل بيانات الموظف' });
        }
      );
    } else {
      // this.spinner.show();
      this.staffService.addStaff(this.newStaff).subscribe(
        () => {
          this.loadStaff();
          this.displayDialog = false;
          // this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الموظف بنجاح' });
        },
        (error: any) => {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إضافة الموظف' });
        }
      );
    }
  }

  updateActiveFlag(event: ToggleButtonChangeEvent, id: number) {
    const newActive = event.checked  ? 1 : 0;
    this.spinner.show();
    this.staffService.updateActive(id, newActive).subscribe(
      () => {
        this.spinner.hide();
        // this.loadStaff(); // Reload staff to reflect changes
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تحديث حالة النشاط بنجاح' });
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحديث حالة النشاط' });
      }
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
    this.spinner.show();
    this.staffService.deleteStaff(id).subscribe(
      () => {
        this.loadStaff();
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الموظف' });
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف الموظف' });
      }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }
}
