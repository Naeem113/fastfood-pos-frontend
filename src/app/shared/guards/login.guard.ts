import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';
import { routesStrings } from '../routes';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  canActivate(): boolean {
    const isAuth = this.authStore.isAuthenticated();

    if (isAuth) {
      this.router.navigate([routesStrings.dashboard]);
      return false;
    }

    return true;
  }
}
