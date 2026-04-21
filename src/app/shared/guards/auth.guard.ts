import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';
import { routesStrings } from '../routes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authStore = inject(AuthStore);
  private router = inject(Router);
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const isAuth = this.authStore.isAuthenticated();
    if (!isAuth) {
      this.router.navigate([routesStrings.login]);
      return false;
    }

    return true;
  }
}
