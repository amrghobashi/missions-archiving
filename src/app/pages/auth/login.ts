import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, CommonModule, MessageModule],
    template: `
        <div class="login-wrapper min-h-screen flex flex-col justify-between items-center relative overflow-hidden bg-slate-950 px-4 py-8 select-none">
            <!-- Dynamic ambient background orbs -->
            <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-sky-500/15 blur-3xl pointer-events-none"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

            <!-- Background subtle dot matrix pattern -->
            <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

            <!-- Top spacer for vertical centering -->
            <div class="hidden sm:block"></div>

            <!-- Login Card Container -->
            <div class="login-card relative z-10 w-full max-w-md my-auto">
                <!-- Card with glassmorphism & subtle border glow -->
                <div class="p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-2xl bg-slate-900/80 border border-white/10 shadow-black/60 transition-all">

                    <!-- Header Section -->
                    <div class="text-center mb-7">
                        <!-- ATSC Logo with illuminated high-contrast text and ambient glow badge -->
                        <div class="flex justify-center mb-5">
                            <div class="relative group">
                                <div class="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-sky-500/25 via-emerald-500/25 to-sky-500/25 blur-md opacity-80 group-hover:opacity-100 transition duration-500"></div>
                                <div class="relative px-7 py-3 rounded-2xl bg-slate-900/90 border border-sky-400/25 shadow-lg shadow-black/40 backdrop-blur-md flex items-center justify-center">
                                    <img src="assets/atsc-bright.png" alt="ATSC Logo" class="h-14 sm:h-16 object-contain drop-shadow-[0_2px_8px_rgba(56,189,248,0.35)]" />
                                </div>
                            </div>
                        </div>

                        <!-- System Security Pill -->
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Operational Archival Portal
                        </div>

                        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0 mb-2">
                            Missions Archiving System
                        </h1>
                        <p class="text-xs sm:text-sm text-slate-400 m-0">
                            Enter your authorized credentials to access records
                        </p>
                    </div>

                    <!-- Error Alert -->
                    <div *ngIf="errorMessage" class="mb-5 p-3.5 rounded-xl text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-red-500/15 border border-red-500/30 text-red-200">
                        <i class="pi pi-exclamation-circle text-base text-red-400 shrink-0"></i>
                        <span>{{ errorMessage }}</span>
                    </div>

                    <!-- Form Controls -->
                    <div class="flex flex-col gap-5">
                        <!-- Email Field -->
                        <div class="flex flex-col gap-1.5">
                            <label for="email" class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                                <i class="pi pi-envelope text-emerald-400"></i> Email Address
                            </label>
                            <input
                                pInputText
                                id="email"
                                type="email"
                                [(ngModel)]="credentials.email"
                                placeholder="name@organization.com"
                                [disabled]="loading"
                                (keyup.enter)="onLogin()"
                                class="w-full text-sm"
                                style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(148, 163, 184, 0.2); color: white; border-radius: 12px; padding: 12px 16px;"
                            />
                        </div>

                        <!-- Password Field -->
                        <div class="flex flex-col gap-1.5">
                            <label for="password" class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                                <i class="pi pi-lock text-emerald-400"></i> Password
                            </label>
                            <p-password
                                id="password"
                                [(ngModel)]="credentials.password"
                                placeholder="Enter your password"
                                [toggleMask]="true"
                                [feedback]="false"
                                [fluid]="true"
                                [disabled]="loading"
                                (keyup.enter)="onLogin()"
                                inputStyleClass="w-full"
                                styleClass="w-full"
                                [inputStyle]="{'background': 'rgba(15, 23, 42, 0.7)', 'border': '1px solid rgba(148, 163, 184, 0.2)', 'color': 'white', 'border-radius': '12px', 'padding': '12px 16px', 'width': '100%', 'font-size': '0.875rem'}"
                            />
                        </div>

                        <!-- Sign In Button -->
                        <button
                            type="button"
                            (click)="onLogin()"
                            [disabled]="loading"
                            class="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-600/25 border-0 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
                            style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"
                        >
                            <i *ngIf="loading" class="pi pi-spin pi-spinner text-base"></i>
                            <i *ngIf="!loading" class="pi pi-sign-in text-base"></i>
                            <span>{{ loading ? 'Authenticating...' : 'Sign In' }}</span>
                        </button>
                    </div>

                    <!-- Security Indicator inside card -->
                    <div class="mt-8 pt-5 border-t border-slate-800 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <i class="pi pi-shield text-emerald-400"></i>
                        <span>Secured with end-to-end institutional archival encryption</span>
                    </div>
                </div>
            </div>

            <!-- Bottom Global Footer -->
            <footer class="relative z-10 mt-6 sm:mt-8 text-center max-w-xxl mx-auto">
                <p style="width: max-content;" class="text-xs sm:text-sm text-slate-400 font-medium tracking-wide m-0">
                    Designed and implemented by Sigma International Company. All rights reserved &copy; 2026
                </p>
            </footer>
        </div>
    `,
    styles: [`
        :host ::ng-deep .p-password-input {
            background: rgba(15, 23, 42, 0.7) !important;
            border: 1px solid rgba(148, 163, 184, 0.2) !important;
            color: white !important;
            border-radius: 12px !important;
            padding: 12px 16px !important;
            width: 100% !important;
            transition: all 0.2s ease;
        }
        :host ::ng-deep .p-password-input::placeholder { color: rgba(148, 163, 184, 0.5) !important; }
        :host ::ng-deep .p-inputtext::placeholder { color: rgba(148, 163, 184, 0.5) !important; }
        :host ::ng-deep .p-inputtext:focus,
        :host ::ng-deep .p-password-input:focus {
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.35) !important;
            border-color: #10b981 !important;
            background: rgba(15, 23, 42, 0.85) !important;
        }
        :host ::ng-deep .p-password-toggle-mask-icon {
            color: rgba(148, 163, 184, 0.8) !important;
            right: 14px !important;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        :host ::ng-deep .p-password-toggle-mask-icon:hover {
            color: #10b981 !important;
        }
    `]
})
export class Login {
    credentials: LoginRequest = { email: '', password: '' };
    loading = false;
    errorMessage = '';
    currentYear = new Date().getFullYear();

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // If already logged in, redirect to default allowed route
        if (this.authService.isLoggedIn()) {
            this.router.navigateByUrl(this.authService.getDefaultRoute());
        }
    }

    onLogin(): void {
        if (!this.credentials.email || !this.credentials.password) {
            this.errorMessage = 'Please enter your email and password.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.authService.login(this.credentials).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigateByUrl(this.authService.getDefaultRoute());
            },
            error: (err) => {
                this.loading = false;
                if (err.status === 401 || err.status === 422) {
                    this.errorMessage = 'Invalid email or password. Please try again.';
                } else if (err.status === 0) {
                    this.errorMessage = 'Unable to reach the server. Please check your connection.';
                } else {
                    this.errorMessage = 'An error occurred. Please try again later.';
                }
            }
        });
    }
}
