import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserTypesComponent } from './user-types/user-types.component';
import { PagesComponent } from './pages/pages.component';
import { LookupsComponent } from './lookups/lookups.component';

export default [
    { path: 'users', component: UsersComponent },
    { path: 'user-types', component: UserTypesComponent },
    { path: 'pages', component: PagesComponent },
    { path: 'lookups', component: LookupsComponent },
    { path: '', redirectTo: 'users', pathMatch: 'full' }
] as Routes;
