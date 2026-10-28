import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
};

export const pageAccessGuard = (requiredRoute: string): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isLoggedIn()) {
            return router.createUrlTree(['/auth/login']);
        }

        if (authService.isAdmin() || authService.hasRouteAccess(requiredRoute)) {
            return true;
        }

        return router.createUrlTree(['/auth/access']);
    };
};

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn() && authService.isAdmin()) {
        return true;
    }

    return router.createUrlTree(['/auth/access']);
};

export const defaultRedirectGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return router.createUrlTree(['/auth/login']);
    }

    return router.createUrlTree([authService.getDefaultRoute()]);
};
