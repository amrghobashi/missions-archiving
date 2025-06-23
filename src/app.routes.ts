import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/layout/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { MissionContainerComponent } from './app/layout/component/home/mission-container/mission-container.component';
import { StaffComponent } from './app/layout/component/home/staff/staff.component';
import { UnitComponent } from './app/layout/component/home/unit/unit.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: MissionContainerComponent },
            { path: 'mission', component: MissionContainerComponent },
            { path: 'staff', component: StaffComponent },
            { path: 'unit', component: UnitComponent }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
