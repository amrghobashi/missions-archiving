import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LookupService, LookupItem, LookupType } from '../../../core/services/lookup.service';

interface LookupTabConfig {
  type: LookupType;
  title: string;
  singular: string;
  icon: string;
  description: string;
  badgeCount: number;
}

@Component({
  selector: 'app-lookups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    BadgeModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="card">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 flex items-center gap-2">
            <i class="pi pi-th-large text-primary"></i>
            System Lookups Management
          </h2>
          <p class="text-muted-color text-sm mt-1">Manage system lookups for purposes, zones, unit types, phases, and cars.</p>
        </div>

        <p-button
          [label]="'Add ' + currentTabConfig.singular"
          icon="pi pi-plus"
          (onClick)="openNew()"
        />
      </div>

      <!-- Tab Switcher Navigation -->
      <div class="flex flex-wrap gap-2 mb-6 p-2 bg-surface-100 dark:bg-surface-800 rounded-xl">
        <button
          *ngFor="let tab of tabs"
          type="button"
          (click)="selectTab(tab.type)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          [ngClass]="activeTab === tab.type
            ? 'bg-primary text-white shadow-sm'
            : 'text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700'"
        >
          <i [class]="tab.icon"></i>
          <span>{{ tab.title }}</span>
          <span
            class="text-xs px-2 py-0.5 rounded-full"
            [ngClass]="activeTab === tab.type ? 'bg-white/20 text-white' : 'bg-surface-300 dark:bg-surface-600 text-surface-800 dark:text-surface-200'"
          >
            {{ tab.badgeCount }}
          </span>
        </button>
      </div>

      <!-- Current Tab Description & Search -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 class="text-lg font-semibold text-surface-800 dark:text-surface-100 flex items-center gap-2">
            <i [class]="currentTabConfig.icon + ' text-primary'"></i>
            {{ currentTabConfig.title }}
          </h3>
          <p class="text-xs text-muted-color">{{ currentTabConfig.description }}</p>
        </div>

        <p-iconfield iconPosition="left">
          <p-inputicon class="pi pi-search"></p-inputicon>
          <input
            pInputText
            type="text"
            placeholder="Search..."
            (input)="onGlobalFilter($event)"
            class="w-full md:w-64"
          />
        </p-iconfield>
      </div>

      <!-- Data Table -->
      <p-table
        #dt
        [value]="items"
        [loading]="loading"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25, 50]"
        [globalFilterFields]="['name', 'id']"
        dataKey="id"
        responsiveLayout="scroll"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 80px">#</th>
            <th style="width: 180px">{{ activeTab === 'cars' ? 'Plate No. / Code' : 'ID' }}</th>
            <th>{{ activeTab === 'cars' ? 'Car Model / Description' : 'Name' }}</th>
            <th style="width: 130px" class="text-center">Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-item let-i="rowIndex">
          <tr>
            <td>{{ i + 1 }}</td>
            <td>
              <code class="text-xs font-semibold bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded">
                {{ item.id }}
              </code>
            </td>
            <td><span class="font-medium text-surface-900 dark:text-surface-0">{{ item.name }}</span></td>
            <td class="text-center">
              <div class="flex justify-center gap-2">
                <p-button
                  icon="pi pi-pencil"
                  [text]="true"
                  severity="info"
                  (onClick)="editItem(item)"
                  pTooltip="Edit"
                  tooltipPosition="top"
                />
                <p-button
                  icon="pi pi-trash"
                  [text]="true"
                  severity="danger"
                  (onClick)="confirmDelete(item)"
                  pTooltip="Delete"
                  tooltipPosition="top"
                />
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center text-muted-color py-8">
              <i class="pi pi-inbox text-3xl mb-2 block"></i>
              No {{ currentTabConfig.title.toLowerCase() }} found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Create / Edit Dialog -->
    <p-dialog
      [(visible)]="dialogVisible"
      [header]="editMode ? 'Edit ' + currentTabConfig.singular : 'New ' + currentTabConfig.singular"
      [modal]="true"
      [style]="{ width: '450px' }"
      [closable]="true"
      (onHide)="resetForm()"
    >
      <div class="flex flex-col gap-4 pt-2">

        <!-- Plate No. / ID (for Cars) -->
        <div *ngIf="activeTab === 'cars'" class="flex flex-col gap-1.5">
          <label class="font-medium text-sm">
            Plate Number / Code <span class="text-red-500">*</span>
          </label>
          <input
            pInputText
            [(ngModel)]="formId"
            placeholder="e.g. س ي ر - 7139"
            class="w-full"
            [disabled]="editMode"
            autofocus
          />
          <small *ngIf="editMode" class="text-xs text-muted-color">Car code cannot be changed once created.</small>
        </div>

        <!-- Name / Description -->
        <div class="flex flex-col gap-1.5">
          <label class="font-medium text-sm">
            {{ activeTab === 'cars' ? 'Car Model / Description' : 'Name' }}
            <span class="text-red-500">*</span>
          </label>
          <input
            pInputText
            [(ngModel)]="formName"
            [placeholder]="activeTab === 'cars' ? 'e.g. تويوتا (كابينة)' : 'Enter ' + currentTabConfig.singular.toLowerCase() + ' name'"
            class="w-full"
            (keyup.enter)="saveItem()"
            [autofocus]="activeTab !== 'cars'"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button
            label="Cancel"
            [text]="true"
            severity="secondary"
            (onClick)="dialogVisible = false"
          />
          <p-button
            [label]="editMode ? 'Update' : 'Create'"
            icon="pi pi-check"
            [loading]="saving"
            (onClick)="saveItem()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class LookupsComponent implements OnInit {
  activeTab: LookupType = 'purposes';

  tabs: LookupTabConfig[] = [
    {
      type: 'purposes',
      title: 'Purposes',
      singular: 'Purpose',
      icon: 'pi pi-bookmark',
      description: 'Defines operational purposes for missions (e.g. Periodic maintenance, Troubleshooting).',
      badgeCount: 0
    },
    {
      type: 'zones',
      title: 'Zones',
      singular: 'Zone',
      icon: 'pi pi-map',
      description: 'Geographical military sectors and operational zones.',
      badgeCount: 0
    },
    {
      type: 'unit-types',
      title: 'Unit Types',
      singular: 'Unit Type',
      icon: 'pi pi-server',
      description: 'Equipment and sensor unit types (e.g. MS3, MBSS, MBSV, IFT).',
      badgeCount: 0
    },
    {
      type: 'phases',
      title: 'Phases',
      singular: 'Phase',
      icon: 'pi pi-calendar',
      description: 'Project deployment and contractual operational phases (e.g. Phase-1, Phase-2).',
      badgeCount: 0
    },
    {
      type: 'cars',
      title: 'Cars',
      singular: 'Car',
      icon: 'pi pi-car',
      description: 'Vehicle registry with plate numbers, codes, and vehicle descriptions.',
      badgeCount: 0
    }
  ];

  items: LookupItem[] = [];
  loading = false;
  saving = false;

  dialogVisible = false;
  editMode = false;
  selectedId: any = null;
  formId = '';
  formName = '';

  constructor(
    private lookupService: LookupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  get currentTabConfig(): LookupTabConfig {
    return this.tabs.find((t) => t.type === this.activeTab)!;
  }

  ngOnInit(): void {
    this.loadAllCounts();
    this.loadCurrentTabItems();
  }

  selectTab(type: LookupType): void {
    if (this.activeTab === type) return;
    this.activeTab = type;
    this.loadCurrentTabItems();
  }

  loadAllCounts(): void {
    this.tabs.forEach((tab) => {
      this.lookupService.getItems(tab.type).subscribe({
        next: (res) => {
          tab.badgeCount = res.length;
        },
        error: () => {}
      });
    });
  }

  loadCurrentTabItems(): void {
    this.loading = true;
    this.lookupService.getItems(this.activeTab).subscribe({
      next: (data) => {
        this.items = data;
        this.currentTabConfig.badgeCount = data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to load ${this.currentTabConfig.title.toLowerCase()}.`
        });
      }
    });
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.toLowerCase();
    if (!filterValue) {
      this.loadCurrentTabItems();
      return;
    }
    this.items = this.items.filter((item) =>
      item.name.toLowerCase().includes(filterValue) || String(item.id).toLowerCase().includes(filterValue)
    );
  }

  openNew(): void {
    this.editMode = false;
    this.selectedId = null;
    this.formId = '';
    this.formName = '';
    this.dialogVisible = true;
  }

  editItem(item: LookupItem): void {
    this.editMode = true;
    this.selectedId = item.id;
    this.formId = String(item.id);
    this.formName = item.name;
    this.dialogVisible = true;
  }

  resetForm(): void {
    this.formId = '';
    this.formName = '';
    this.selectedId = null;
    this.editMode = false;
  }

  saveItem(): void {
    if (this.activeTab === 'cars') {
      if (!this.formId.trim() || !this.formName.trim()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Plate number/code and description are required.'
        });
        return;
      }
    } else {
      if (!this.formName.trim()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Name cannot be empty.'
        });
        return;
      }
    }

    this.saving = true;

    if (this.editMode && this.selectedId !== null) {
      const payload = this.activeTab === 'cars'
        ? { id: this.formId.trim(), name: this.formName.trim() }
        : this.formName.trim();

      this.lookupService.updateItem(this.activeTab, this.selectedId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.dialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `${this.currentTabConfig.singular} updated successfully.`
          });
          this.loadCurrentTabItems();
          this.loadAllCounts();
        },
        error: (err) => {
          this.saving = false;
          const msg = err?.error?.message || `Failed to update ${this.currentTabConfig.singular.toLowerCase()}.`;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
        }
      });
    } else {
      const payload = this.activeTab === 'cars'
        ? { id: this.formId.trim(), name: this.formName.trim() }
        : this.formName.trim();

      this.lookupService.addItem(this.activeTab, payload).subscribe({
        next: () => {
          this.saving = false;
          this.dialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `${this.currentTabConfig.singular} created successfully.`
          });
          this.loadCurrentTabItems();
          this.loadAllCounts();
        },
        error: (err) => {
          this.saving = false;
          const msg = err?.error?.message || `Failed to create ${this.currentTabConfig.singular.toLowerCase()}.`;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
        }
      });
    }
  }

  confirmDelete(item: LookupItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${item.name}" from ${this.currentTabConfig.title}? Related records might be affected.`,
      header: `Delete ${this.currentTabConfig.singular}`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.lookupService.deleteItem(this.activeTab, item.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `${this.currentTabConfig.singular} deleted successfully.`
            });
            this.loadCurrentTabItems();
            this.loadAllCounts();
          },
          error: (err) => {
            const msg = err?.error?.message || `Failed to delete ${this.currentTabConfig.singular.toLowerCase()}.`;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
          }
        });
      }
    });
  }
}
