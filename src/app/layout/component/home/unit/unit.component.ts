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
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, InputTextModule,
    ConfirmDialogModule, ToastModule, NgxSpinnerModule, SelectModule,
    IconFieldModule, InputIconModule, DatePickerModule],
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load units data' });
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
      warranty_start_date: '',
      warranty_end_date: '',
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

  // Helper to parse dd/MM/yyyy to Date
  parseDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(+year, +month - 1, +day);
  }

  onEditUnit(unit: Unit) {
    this.newUnit = { ...unit };
    // Parse warranty_start_date if in dd/MM/yyyy format
    if (unit.warranty_start_date) {
      if (typeof unit.warranty_start_date === 'string' && unit.warranty_start_date.includes('/')) {
        this.newUnit.warranty_start_date = this.parseDDMMYYYY(unit.warranty_start_date);
      } else {
        this.newUnit.warranty_start_date = new Date(unit.warranty_start_date);
      }
    }
    // Parse warranty_end_date if in dd/MM/yyyy format
    if (unit.warranty_end_date) {
      if (typeof unit.warranty_end_date === 'string' && unit.warranty_end_date.includes('/')) {
        this.newUnit.warranty_end_date = this.parseDDMMYYYY(unit.warranty_end_date);
      } else {
        this.newUnit.warranty_end_date = new Date(unit.warranty_end_date);
      }
    }
    this.isEditMode = true;
    this.displayDialog = true;
  }

  saveUnit() {
    if (this.newUnit.warranty_start_date) {
      const dateObj = new Date(this.newUnit.warranty_start_date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      this.newUnit.warranty_start_date = `${year}-${month}-${day}`;
    }
    if (this.newUnit.warranty_end_date) {
      const dateObj = new Date(this.newUnit.warranty_end_date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      this.newUnit.warranty_end_date = `${year}-${month}-${day}`;
    }
    if (this.isEditMode) {
      // this.spinner.show();
      this.unitService.updateUnit(this.newUnit).subscribe(
        () => {
          this.loadUnits();
          this.displayDialog = false;
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Unit updated successfully' });
        },
        (error: any) => {
          // this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update unit' });
        }
      );
    } else {
      // this.spinner.show();
      this.unitService.addUnit(this.newUnit).subscribe(
        () => {
          this.loadUnits();
          this.displayDialog = false;
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Unit added successfully' });
        },
        (error: any) => {
          // this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add unit' });
        }
      );
    }
  }

  confirmDeleteUnit(unit: Unit) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this unit?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
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
        this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Unit deleted successfully' });
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete unit' });
      }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }
}
