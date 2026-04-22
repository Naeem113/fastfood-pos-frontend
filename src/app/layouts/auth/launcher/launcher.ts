import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/stores/auth.store';
import { COMMON_IMPORTS } from '../../../shared/common';
import { routesStrings } from '../../../shared/routes';

@Component({
  selector: 'app-launcher',
  imports: [...COMMON_IMPORTS],
  templateUrl: './launcher.html',
  styleUrls: ['./launcher.scss'],
})
export class Launcher {
  private router = inject(Router);
  private auth = inject(AuthStore);

  user = this.auth.currentUser();

  goToDashboard() {
    localStorage.setItem('launcherValue', 'dashboard');
    this.router.navigate([routesStrings.dashboard]);
  }

  goToPOS() {
    localStorage.setItem('launcherValue', 'pos');
    // this.router.navigate([routesStrings.pos]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate([routesStrings.login]);
  }
}
