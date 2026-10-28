import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from '../admin.service';
import { Page } from '../../../core/models/auth.model';

@Component({
    selector: 'app-pages',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
        InputTextModule, ToastModule, ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <div class="card">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-xl font-bold">Pages / Routes</h2>
                    <p class="text-muted-color text-sm mt-1">Register application pages to assign permissions to user types.</p>
                </div>
                <p-button label="Add Page" icon="pi pi-plus" (onClick)="openNew()" />
            </div>

            <p-table
                [value]="pages"
                [loading]="loading"
                [paginator]="true"
                [rows]="15"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th>#</th>
                        <th>Page Name</th>
                        <th>Route / URL</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-page let-i="rowIndex">
                    <tr>
                        <td>{{ i + 1 }}</td>
                        <td><span class="font-medium">{{ page.name }}</span></td>
                        <td>
                            <code *ngIf="page.route" class="text-sm bg-surface-100 px-2 py-1 rounded">{{ page.route }}</code>
                            <span *ngIf="!page.route" class="text-muted-color">—</span>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <p-button icon="pi pi-pencil" [text]="true" severity="info" (onClick)="editPage(page)" pTooltip="Edit" />
                                <p-button icon="pi pi-trash" [text]="true" severity="danger" (onClick)="confirmDelete(page)" pTooltip="Delete" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="4" class="text-center text-muted-color py-8">No pages registered yet.</td></tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Add/Edit Dialog -->
        <p-dialog
            [(visible)]="dialogVisible"
            [header]="editMode ? 'Edit Page' : 'Add New Page'"
            [modal]="true"
            [style]="{ width: '420px' }"
            (onHide)="resetForm()"
        >
            <div class="flex flex-col gap-4 pt-2">
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Page Name <span class="text-red-500">*</span></label>
                    <input pInputText [(ngModel)]="form.name" placeholder="e.g. Dashboard" class="w-full" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Route / URL</label>
                    <input pInputText [(ngModel)]="form.route" placeholder="e.g. /dashboard" class="w-full" />
                    <small class="text-muted-color">Optional. Angular router path for this page.</small>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" [text]="true" severity="secondary" (onClick)="dialogVisible = false" />
                    <p-button [label]="editMode ? 'Update' : 'Create'" [loading]="saving" (onClick)="savePage()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class PagesComponent implements OnInit {
    pages: Page[] = [];
    loading = false;
    saving = false;
    dialogVisible = false;
    editMode = false;
    selectedPageId: number | null = null;

    form: { name: string; route: string } = { name: '', route: '' };

    constructor(
        private adminService: AdminService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loadPages();
    }

    loadPages(): void {
        this.loading = true;
        this.adminService.getPages().subscribe({
            next: (pages) => {
                this.pages = pages;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load pages.' });
            }
        });
    }

    openNew(): void {
        this.editMode = false;
        this.selectedPageId = null;
        this.resetForm();
        this.dialogVisible = true;
    }

    editPage(page: Page): void {
        this.editMode = true;
        this.selectedPageId = page.id;
        this.form = { name: page.name, route: page.route ?? '' };
        this.dialogVisible = true;
    }

    resetForm(): void {
        this.form = { name: '', route: '' };
    }

    savePage(): void {
        if (!this.form.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Page name is required.' });
            return;
        }

        this.saving = true;
        const payload = { name: this.form.name, route: this.form.route || null };

        if (this.editMode && this.selectedPageId) {
            this.adminService.updatePage(this.selectedPageId, payload).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;
                    this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Page updated.' });
                    this.loadPages();
                },
                error: () => {
                    this.saving = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update page.' });
                }
            });
        } else {
            this.adminService.createPage(payload).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;
                    this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Page added.' });
                    this.loadPages();
                },
                error: () => {
                    this.saving = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add page.' });
                }
            });
        }
    }

    confirmDelete(page: Page): void {
        this.confirmationService.confirm({
            message: `Delete page "${page.name}"? This will remove it from all user type permissions.`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.adminService.deletePage(page.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Page deleted.' });
                        this.loadPages();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete page.' });
                    }
                });
            }
        });
    }
}
