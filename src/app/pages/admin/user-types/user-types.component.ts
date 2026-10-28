import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from '../admin.service';
import { UserType, Page } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-user-types',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
        InputTextModule, CheckboxModule, TagModule, ToastModule, ConfirmDialogModule, DividerModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <!-- User Types List -->
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold">User Types</h2>
                    <p-button label="Add Type" icon="pi pi-plus" (onClick)="openNewType()" />
                </div>

                <p-table [value]="userTypes" [loading]="loading" dataKey="id" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-type let-i="rowIndex">
                        <tr [class.bg-primary-50]="selectedType?.id === type.id" style="cursor:pointer" (click)="selectType(type)">
                            <td>{{ i + 1 }}</td>
                            <td>{{ type.name }}</td>
                            <td>
                                <div class="flex gap-2" (click)="$event.stopPropagation()">
                                    <p-button icon="pi pi-pencil" [text]="true" severity="info" (onClick)="editType(type)" pTooltip="Edit" />
                                    <p-button icon="pi pi-trash" [text]="true" severity="danger" (onClick)="confirmDeleteType(type)" pTooltip="Delete" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="3" class="text-center text-muted-color py-8">No user types found.</td></tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- Page Permissions -->
            <div class="card">
                <div class="mb-4">
                    <h2 class="text-xl font-bold">Page Permissions</h2>
                    <p class="text-muted-color text-sm mt-1">
                        {{ selectedType ? 'Editing permissions for: ' + selectedType.name : 'Select a user type to manage its permissions' }}
                    </p>
                </div>

                <div *ngIf="!selectedType" class="text-center text-muted-color py-12">
                    <i class="pi pi-arrow-left text-3xl mb-3 block"></i>
                    Click on a user type to manage its page permissions
                </div>

                <div *ngIf="selectedType">
                    <div class="flex flex-col gap-3 mb-4">
                        <div *ngFor="let page of allPages" class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100">
                            <p-checkbox
                                [ngModel]="isPageSelected(page.id)"
                                (ngModelChange)="togglePage(page.id, $event)"
                                [binary]="true"
                                [inputId]="'page_' + page.id"
                            />
                            <label [for]="'page_' + page.id" class="cursor-pointer flex-1">
                                <span class="font-medium">{{ page.name }}</span>
                                <span *ngIf="page.route" class="ml-2 text-xs text-muted-color">({{ page.route }})</span>
                            </label>
                        </div>
                        <div *ngIf="allPages.length === 0" class="text-center text-muted-color py-4">
                            No pages registered yet. Add them in the Pages tab.
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <p-button label="Save Permissions" icon="pi pi-save" [loading]="savingPerms" (onClick)="savePermissions()" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Type Dialog -->
        <p-dialog
            [(visible)]="typeDialogVisible"
            [header]="typeEditMode ? 'Edit User Type' : 'Add User Type'"
            [modal]="true"
            [style]="{ width: '380px' }"
        >
            <div class="flex flex-col gap-3 pt-2">
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Type Name <span class="text-red-500">*</span></label>
                    <input pInputText [(ngModel)]="typeName" placeholder="e.g. admin group" class="w-full" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" [text]="true" severity="secondary" (onClick)="typeDialogVisible = false" />
                    <p-button [label]="typeEditMode ? 'Update' : 'Create'" [loading]="savingType" (onClick)="saveType()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class UserTypesComponent implements OnInit {
    userTypes: UserType[] = [];
    allPages: Page[] = [];
    selectedType: UserType | null = null;
    selectedPageIds: number[] = [];

    loading = false;
    savingType = false;
    savingPerms = false;
    typeDialogVisible = false;
    typeEditMode = false;
    selectedTypeId: number | null = null;
    typeName = '';

    constructor(
        private adminService: AdminService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.adminService.getUserTypes().subscribe({
            next: (types) => {
                this.userTypes = types;
                this.loading = false;
            }
        });
        this.adminService.getPages().subscribe({
            next: (pages) => (this.allPages = pages)
        });
    }

    selectType(type: UserType): void {
        this.selectedType = type;
        // Load pages assigned to this type
        const typeWithPages = this.userTypes.find((t) => t.id === type.id);
        this.selectedPageIds = typeWithPages?.pages?.map((p: Page) => p.id) ?? [];
        // Fetch fresh data with pages
        this.adminService.getUserTypes().subscribe({
            next: (types) => {
                this.userTypes = types;
                const fresh = types.find((t) => t.id === type.id);
                this.selectedType = fresh ?? type;
                this.selectedPageIds = fresh?.pages?.map((p: Page) => p.id) ?? [];
            }
        });
    }

    isPageSelected(pageId: number): boolean {
        return this.selectedPageIds.includes(pageId);
    }

    togglePage(pageId: number, checked: boolean): void {
        if (checked) {
            this.selectedPageIds = [...this.selectedPageIds, pageId];
        } else {
            this.selectedPageIds = this.selectedPageIds.filter((id) => id !== pageId);
        }
    }

    savePermissions(): void {
        if (!this.selectedType) return;
        this.savingPerms = true;
        this.adminService.assignPagesToUserType(this.selectedType.id, this.selectedPageIds).subscribe({
            next: () => {
                this.savingPerms = false;
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Permissions updated.' });
                this.authService.fetchCurrentUser().subscribe();
                this.loadData();
            },
            error: () => {
                this.savingPerms = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save permissions.' });
            }
        });
    }

    openNewType(): void {
        this.typeEditMode = false;
        this.selectedTypeId = null;
        this.typeName = '';
        this.typeDialogVisible = true;
    }

    editType(type: UserType): void {
        this.typeEditMode = true;
        this.selectedTypeId = type.id;
        this.typeName = type.name;
        this.typeDialogVisible = true;
    }

    saveType(): void {
        if (!this.typeName.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Type name is required.' });
            return;
        }
        this.savingType = true;

        if (this.typeEditMode && this.selectedTypeId) {
            this.adminService.updateUserType(this.selectedTypeId, this.typeName).subscribe({
                next: () => {
                    this.savingType = false;
                    this.typeDialogVisible = false;
                    this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'User type updated.' });
                    this.loadData();
                },
                error: () => {
                    this.savingType = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user type.' });
                }
            });
        } else {
            this.adminService.createUserType(this.typeName).subscribe({
                next: () => {
                    this.savingType = false;
                    this.typeDialogVisible = false;
                    this.messageService.add({ severity: 'success', summary: 'Created', detail: 'User type created.' });
                    this.loadData();
                },
                error: () => {
                    this.savingType = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user type.' });
                }
            });
        }
    }

    confirmDeleteType(type: UserType): void {
        this.confirmationService.confirm({
            message: `Delete user type "${type.name}"? This may affect users assigned to it.`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.adminService.deleteUserType(type.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User type deleted.' });
                        if (this.selectedType?.id === type.id) this.selectedType = null;
                        this.loadData();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user type.' });
                    }
                });
            }
        });
    }
}
