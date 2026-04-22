import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthStore } from '../../core/stores/auth.store';
import { PRIME_NG_IMPORTS } from '../../shared/primeng';
import { routesStrings } from '../../shared/routes';
import { TopBar } from '../../shared/components/dashboard/topbar/topBar';
import { Sidebar } from '../../shared/components/dashboard/sidebar/sidebar';
import { COMMON_IMPORTS } from '../../shared/common';
import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);
@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, ...PRIME_NG_IMPORTS,...COMMON_IMPORTS, TopBar, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  animations: [fadeAnimation],

})
export class Dashboard {

  isSidebarOpen = signal(true);

  toggleSidebar(isOpen?: boolean) {
    if (isOpen !== undefined) {
      this.isSidebarOpen.set(isOpen);
    } else {
      this.isSidebarOpen.update(v => !v);
    }
  }

  router = inject(Router);
  theme = inject(ThemeService);
  authStore = inject(AuthStore);

  toggleTheme() {
    this.theme.toggleTheme();
  }

  logout() {
    this.authStore.logout();
    this.router.navigate([routesStrings.login]);
  }
}
