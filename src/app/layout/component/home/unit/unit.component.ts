import { Component } from '@angular/core';
import { Unit } from '../../models/unit';
import { UnitService } from './unit.service';
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
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, InputTextModule,
    ConfirmDialogModule, ToastModule, NgxSpinnerModule, SelectModule,
    IconFieldModule, InputIconModule],
  providers: [ConfirmationService, MessageService, DatePipe],
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss'
})
export class UnitComponent {
  unitList: Unit[] = [];
  selectedUnit!: Unit;
  displayDialog = false;
  isEditMode = false;
  newUnit: Unit = this.emptyUnit();
  isLoading = false;
  unitTypes: {id: number, name: string}[] = [];
  battelions: {id: number, name: string}[] = [];
  phases: {id: number, name: string}[] = [];

  constructor(private unitService: UnitService, private confirmationService: ConfirmationService, private messageService: MessageService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.loadUnits();
    this.loadUnitTypes();
    this.loadBattelions();
    this.loadPhases();
  }

  loadUnits() {
    this.spinner.show();
    this.unitService.getUnits().subscribe(
      (data: Unit[]) => {
        console.log('Units loaded:', data);
        this.unitList = data;
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل بيانات الوحدات' });
      }
    );
  }

  loadUnitTypes() {
    this.unitService.getUnitTypes().subscribe(
      (types) => { this.unitTypes = types; },
      (error) => { this.unitTypes = []; }
    );
  }

  loadBattelions() {
    this.unitService.getBattelions().subscribe(
      (battelions) => { this.battelions = battelions; },
      (error) => { this.battelions = []; }
    );
  }

  loadPhases() {
    this.unitService.getPhases().subscribe(
      (phases) => { this.phases = phases; },
      (error) => { this.phases = []; }
    );
  }

  emptyUnit(): Unit {
    return {
      id: '',
      name: '',
      unit_lat: '',
      unit_long: '',
      secret_no: '',
      battelion_id: undefined,
      battelion_name: '',
      unit_type_id: undefined,
      unit_type_name: '',
      phase_id: undefined
    };
  }

  onAddUnit() {
    this.isEditMode = false;
    this.displayDialog = true;
    this.newUnit = this.emptyUnit();
  }

  onEditUnit(unit: Unit) {
    this.isEditMode = true;
    this.displayDialog = true;
    this.newUnit = { ...unit };
  }

  saveUnit() {
    if (this.isEditMode) {
      // this.spinner.show();
      this.unitService.updateUnit(this.newUnit).subscribe(
        () => {
          this.loadUnits();
          this.displayDialog = false;
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الوحدة بنجاح' });
        },
        (error: any) => {
          // this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تعديل الوحدة' });
        }
      );
    } else {
      // this.spinner.show();
      this.unitService.addUnit(this.newUnit).subscribe(
        () => {
          this.loadUnits();
          this.displayDialog = false;
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الوحدة بنجاح' });
        },
        (error: any) => {
          // this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إضافة الوحدة' });
        }
      );
    }
  }

  confirmDeleteUnit(unit: Unit) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد حذف هذه الوحدة؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-info-circle',
      rejectLabel: 'إلغاء',
      rejectButtonProps: { label: 'إلغاء', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'حذف', severity: 'danger' },
      accept: () => { this.onDeleteUnit(unit.id); },
      reject: () => {}
    });
  }

  onDeleteUnit(id: string) {
    this.spinner.show();
    this.unitService.deleteUnit(id).subscribe(
      () => {
        this.loadUnits();
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الوحدة' });
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف الوحدة' });
      }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }
}
