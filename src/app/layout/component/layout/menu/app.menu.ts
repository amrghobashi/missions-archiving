import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './menu-item/app.menuitem';
import { AuthService } from '../../../../core/services/auth.service';

interface RouteMeta {
    label: string;
    icon: string;
    routerLink: string[];
    order: number;
}

const ROUTE_META_MAP: Record<string, RouteMeta> = {
    'dashboard': { label: 'Statistics', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard'], order: 1 },
    'mission': { label: 'Missions', icon: 'pi pi-fw pi-flag', routerLink: ['/mission'], order: 2 },
    'staff': { label: 'FSR', icon: 'pi pi-fw pi-users', routerLink: ['/staff'], order: 3 },
    'unit': { label: 'Units', icon: 'pi pi-fw pi-map', routerLink: ['/unit'], order: 4 },
    'car': { label: 'Cars', icon: 'pi pi-fw pi-car', routerLink: ['/car'], order: 5 },
    'lookups': { label: 'Lookups', icon: 'pi pi-fw pi-th-large', routerLink: ['/lookups'], order: 6 },
};

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: 'app-menu.component.html'
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(public authService: AuthService) {
        effect(() => {
            this.buildMenu();
        });
    }

    private buildMenu(): void {
        if (!this.authService.isLoggedIn()) {
            this.model = [];
            return;
        }

        const userPages = this.authService.userPages();
        const isAdmin = this.authService.isAdmin();
        const mainMenuItems: MenuItem[] = [];
        const seenRoutes = new Set<string>();

        // Build items based on routes assigned to the logged in user's user type
        for (const page of userPages) {
            if (!page.route) continue;
            const cleanRoute = page.route.replace(/^\/+|\/+$/g, '').toLowerCase();

            // Ignore administration routes from the main menu
            if (cleanRoute.startsWith('admin')) continue;
            if (seenRoutes.has(cleanRoute)) continue;
            seenRoutes.add(cleanRoute);

            const meta = ROUTE_META_MAP[cleanRoute];
            mainMenuItems.push({
                label: page.name || meta?.label || cleanRoute,
                icon: meta?.icon || 'pi pi-fw pi-circle',
                routerLink: meta?.routerLink || ['/' + cleanRoute],
                id: meta ? String(meta.order) : '99'
            });
        }

        // Fallback for admin if no pages are linked to their user type yet
        if (mainMenuItems.length === 0 && isAdmin) {
            Object.entries(ROUTE_META_MAP).forEach(([route, meta]) => {
                mainMenuItems.push({
                    label: meta.label,
                    icon: meta.icon,
                    routerLink: meta.routerLink,
                    id: String(meta.order)
                });
            });
        }

        // Sort items by designated order
        mainMenuItems.sort((a, b) => Number(a.id || 99) - Number(b.id || 99));

        const newModel: MenuItem[] = [];

        // 1. Main Menu Section (only if user has accessible pages)
        if (mainMenuItems.length > 0) {
            newModel.push({
                label: 'Main Menu',
                icon: 'pi pi-fw pi-home',
                items: mainMenuItems
            });
        }

        // 2. Administration Section (only for admin users)
        if (isAdmin) {
            newModel.push({
                label: 'Administration',
                icon: 'pi pi-fw pi-shield',
                items: [
                    { label: 'Users', icon: 'pi pi-fw pi-user', routerLink: ['/admin/users'] },
                    { label: 'Users Permissions', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/user-types'] },
                    // { label: 'Pages', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/pages'] },
                    // { label: 'Lookups', icon: 'pi pi-fw pi-th-large', routerLink: ['/lookups'] },
                ]
            });
        }

        this.model = newModel;
    }
}
