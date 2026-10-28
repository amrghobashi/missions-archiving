import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Page, User } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
    private _user = signal<User | null>(this._loadUser());

    readonly isLoggedIn = computed(() => !!this._token());
    readonly currentUser = computed(() => this._user());
    
    readonly isAdmin = computed(() => {
        const user = this._user();
        if (!user) return false;
        const typeName = typeof user.user_type === 'string'
            ? user.user_type.toLowerCase()
            : (user.user_type?.name || '').toLowerCase();
        return typeName.includes('admin') || user.user_type_id === 1;
    });

    readonly userPages = computed<Page[]>(() => {
        const user = this._user();
        if (!user || !user.pages) return [];
        return user.pages.map((p: any) => {
            if (typeof p === 'string') {
                return { id: 0, name: p, route: p };
            }
            return p as Page;
        });
    });

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        if (this.isLoggedIn()) {
            this.fetchCurrentUser().subscribe({
                error: () => {} // If token is invalid or network fails, ignore or handled by interceptor
            });
        }
    }

    private _loadUser(): User | null {
        const stored = localStorage.getItem(this.USER_KEY);
        if (!stored) return null;
        try {
            return JSON.parse(stored) as User;
        } catch {
            return null;
        }
    }

    getToken(): string | null {
        return this._token();
    }

    fetchCurrentUser(): Observable<User> {
        return this.http.get<User>(`${environment.API_URL}me`).pipe(
            tap((user) => {
                this._user.set(user);
                localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            })
        );
    }

    hasRouteAccess(route: string): boolean {
        const user = this._user();
        if (!user) return false;

        const target = route.replace(/^\/+|\/+$/g, '').toLowerCase();

        // Check routes array
        if (user.routes && Array.isArray(user.routes)) {
            const match = user.routes.some((r) => (r || '').replace(/^\/+|\/+$/g, '').toLowerCase() === target);
            if (match) return true;
        }

        // Check pages array
        if (user.pages && Array.isArray(user.pages)) {
            const match = user.pages.some((p: any) => {
                const r = (typeof p === 'string' ? p : p?.route || '').replace(/^\/+|\/+$/g, '').toLowerCase();
                return r === target;
            });
            if (match) return true;
        }

        return false;
    }

    getDefaultRoute(): string {
        const user = this._user();
        if (!user) return '/auth/login';

        if (this.isAdmin() || this.hasRouteAccess('dashboard')) {
            return '/dashboard';
        }

        const pages = this.userPages();
        for (const p of pages) {
            if (p.route) {
                const clean = p.route.replace(/^\/+|\/+$/g, '');
                if (clean) return '/' + clean;
            }
        }

        if (user.routes && user.routes.length > 0) {
            const clean = user.routes[0].replace(/^\/+|\/+$/g, '');
            if (clean) return '/' + clean;
        }

        return '/auth/access';
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.API_URL}auth/login`, credentials).pipe(
            tap((response) => {
                this._token.set(response.token);
                this._user.set(response.user);
                localStorage.setItem(this.TOKEN_KEY, response.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            })
        );
    }

    logout(): void {
        const token = this._token();
        if (token) {
            this.http.post(`${environment.API_URL}auth/logout`, {}).subscribe({
                error: () => {}
            });
        }
        this._token.set(null);
        this._user.set(null);
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.router.navigate(['/auth/login']);
    }
}
