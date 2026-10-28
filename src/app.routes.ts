import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/layout/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { MissionContainerComponent } from './app/layout/component/home/mission-container/mission-container.component';
import { StaffComponent } from './app/layout/component/home/staff/staff.component';
import { UnitComponent } from './app/layout/component/home/unit/unit.component';
import { DashboardComponent } from './app/layout/component/home/dashboard/dashboard.component';
import { CarComponent } from './app/layout/component/home/car/car.component';
import { LookupsComponent } from './app/pages/admin/lookups/lookups.component';
import { authGuard, pageAccessGuard, adminGuard, defaultRedirectGuard } from './app/core/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', canActivate: [defaultRedirectGuard], pathMatch: 'full', children: [] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [pageAccessGuard('dashboard')] },
            { path: 'mission', component: MissionContainerComponent, canActivate: [pageAccessGuard('mission')] },
            { path: 'staff', component: StaffComponent, canActivate: [pageAccessGuard('staff')] },
            { path: 'unit', component: UnitComponent, canActivate: [pageAccessGuard('unit')] },
            { path: 'car', component: CarComponent, canActivate: [pageAccessGuard('car')] },
            { path: 'lookups', component: LookupsComponent, canActivate: [pageAccessGuard('lookups')] },
            { path: 'admin', loadChildren: () => import('./app/pages/admin/admin.routes'), canActivate: [adminGuard] }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
