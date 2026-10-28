import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { LayoutService } from '../../../service/layout.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ButtonModule, AvatarModule, MenuModule],
    templateUrl: 'app-topbar.Component.html'
})
export class AppTopbar {
    items!: MenuItem[];
    userMenuItems: MenuItem[] = [];

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService
    ) {
        this.userMenuItems = [
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.authService.logout()
            }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    get userInitials(): string {
        const name = this.authService.currentUser()?.name ?? '';
        return name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    }
}
