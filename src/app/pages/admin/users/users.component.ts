import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService, CreateUserPayload, UpdateUserPayload } from '../admin.service';
import { User, UserType } from '../../../core/models/auth.model';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
        InputTextModule, PasswordModule, SelectModule, ToggleSwitchModule,
        TagModule, ToastModule, ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <div class="card">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">User Management</h2>
                <p-button label="Add User" icon="pi pi-plus" (onClick)="openNew()" />
            </div>

            <p-table
                [value]="users"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[5, 10, 25]"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>User Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-user let-i="rowIndex">
                    <tr>
                        <td>{{ i + 1 }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ getUserTypeName(user.user_type_id) }}</td>
                        <td>
                            <p-tag
                                [value]="user.active ? 'Active' : 'Inactive'"
                                [severity]="user.active ? 'success' : 'danger'"
                            />
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <p-button icon="pi pi-pencil" [text]="true" severity="info" (onClick)="editUser(user)" pTooltip="Edit" />
                                <p-button icon="pi pi-trash" [text]="true" severity="danger" (onClick)="confirmDelete(user)" pTooltip="Delete" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="6" class="text-center text-muted-color py-8">No users found.</td></tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Add/Edit Dialog -->
        <p-dialog
            [(visible)]="dialogVisible"
            [header]="editMode ? 'Edit User' : 'Add New User'"
            [modal]="true"
            [style]="{ width: '480px' }"
            [closable]="true"
            (onHide)="resetForm()"
        >
            <div class="flex flex-col gap-4 pt-2">
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Name <span class="text-red-500">*</span></label>
                    <input pInputText [(ngModel)]="form.name" placeholder="Full name" class="w-full" />
                </div>

                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Email <span class="text-red-500">*</span></label>
                    <input pInputText type="email" [(ngModel)]="form.email" placeholder="user@example.com" class="w-full" />
                </div>

                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">User Type</label>
                    <p-select
                        [(ngModel)]="form.user_type_id"
                        [options]="userTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select user type"
                        [fluid]="true"
                    />
                </div>
                
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">
                        Password <span *ngIf="!editMode" class="text-red-500">*</span>
                        <span *ngIf="editMode" class="text-muted-color text-xs">(leave blank to keep current)</span>
                    </label>
                    <p-password [(ngModel)]="form.password" [feedback]="false" [toggleMask]="true" [fluid]="true" placeholder="Password" />
                </div>

                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Confirm Password</label>
                    <p-password [(ngModel)]="form.password_confirmation" [feedback]="false" [toggleMask]="true" [fluid]="true" placeholder="Confirm password" />
                </div>

                

                <div class="flex items-center gap-3">
                    <label class="font-medium text-sm">Active</label>
                    <p-toggleswitch [(ngModel)]="formActive" />
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" [text]="true" severity="secondary" (onClick)="dialogVisible = false" />
                    <p-button [label]="editMode ? 'Update' : 'Create'" [loading]="saving" (onClick)="saveUser()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    userTypes: UserType[] = [];
    userTypeOptions: { label: string; value: number | null }[] = [];

    loading = false;
    saving = false;
    dialogVisible = false;
    editMode = false;
    selectedUserId: number | null = null;

    form = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type_id: null as number | null
    };
    formActive = true;

    constructor(
        private adminService: AdminService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.adminService.getUserTypes().subscribe({
            next: (types) => {
                this.userTypes = types;
                this.userTypeOptions = [
                    { label: '— No Type —', value: null },
                    ...types.map((t) => ({ label: t.name, value: t.id }))
                ];
            }
        });
        this.adminService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users.' });
            }
        });
    }

    getUserTypeName(id: number | null): string {
        if (!id) return '—';
        return this.userTypes.find((t) => t.id === id)?.name ?? '—';
    }

    openNew(): void {
        this.editMode = false;
        this.selectedUserId = null;
        this.resetForm();
        this.dialogVisible = true;
    }

    editUser(user: User): void {
        this.editMode = true;
        this.selectedUserId = user.id;
        this.form = {
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            user_type_id: user.user_type_id
        };
        this.formActive = !!user.active;
        this.dialogVisible = true;
    }

    resetForm(): void {
        this.form = { name: '', email: '', password: '', password_confirmation: '', user_type_id: null };
        this.formActive = true;
    }

    saveUser(): void {
        if (!this.form.name || !this.form.email) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Name and email are required.' });
            return;
        }
        if (!this.editMode && !this.form.password) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Password is required for new users.' });
            return;
        }

        this.saving = true;
        const active = this.formActive ? 1 : 0;

        if (this.editMode && this.selectedUserId) {
            const payload: UpdateUserPayload = {
                name: this.form.name,
                email: this.form.email,
                user_type_id: this.form.user_type_id,
                active
            };
            if (this.form.password) {
                payload.password = this.form.password;
                payload.password_confirmation = this.form.password_confirmation;
            }
            this.adminService.updateUser(this.selectedUserId, payload).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully.' });
                    this.loadData();
                },
                error: (err) => {
                    this.saving = false;
                    const detail = err?.error?.message ?? 'Failed to update user.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
        } else {
            const payload: CreateUserPayload = {
                name: this.form.name,
                email: this.form.email,
                password: this.form.password,
                password_confirmation: this.form.password_confirmation,
                user_type_id: this.form.user_type_id,
                active
            };
            this.adminService.createUser(payload).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully.' });
                    this.loadData();
                },
                error: (err) => {
                    this.saving = false;
                    const detail = err?.error?.message ?? 'Failed to create user.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
        }
    }

    confirmDelete(user: User): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${user.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.adminService.deleteUser(user.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted.' });
                        this.loadData();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.' });
                    }
                });
            }
        });
    }
}
