import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserType, Page } from '../../core/models/auth.model';

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    user_type_id: number | null;
    active: number;
}

export interface UpdateUserPayload {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    user_type_id: number | null;
    active: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
    private base = environment.API_URL;

    constructor(private http: HttpClient) {}

    // ── Users ──
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.base}admin/users`);
    }
    createUser(payload: CreateUserPayload): Observable<User> {
        return this.http.post<User>(`${this.base}admin/users`, payload);
    }
    updateUser(id: number, payload: UpdateUserPayload): Observable<User> {
        return this.http.put<User>(`${this.base}admin/users/${id}`, payload);
    }
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}admin/users/${id}`);
    }

    // ── User Types ──
    getUserTypes(): Observable<UserType[]> {
        return this.http.get<UserType[]>(`${this.base}admin/user-types`);
    }
    createUserType(name: string): Observable<UserType> {
        return this.http.post<UserType>(`${this.base}admin/user-types`, { name });
    }
    updateUserType(id: number, name: string): Observable<UserType> {
        return this.http.put<UserType>(`${this.base}admin/user-types/${id}`, { name });
    }
    deleteUserType(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}admin/user-types/${id}`);
    }
    assignPagesToUserType(userTypeId: number, pageIds: number[]): Observable<any> {
        return this.http.put(`${this.base}admin/user-types/${userTypeId}`, { pages: pageIds });
    }

    // ── Pages ──
    getPages(): Observable<Page[]> {
        return this.http.get<Page[]>(`${this.base}admin/pages`);
    }
    createPage(payload: Partial<Page>): Observable<Page> {
        return this.http.post<Page>(`${this.base}admin/pages`, payload);
    }
    updatePage(id: number, payload: Partial<Page>): Observable<Page> {
        return this.http.put<Page>(`${this.base}admin/pages/${id}`, payload);
    }
    deletePage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}admin/pages/${id}`);
    }
}
