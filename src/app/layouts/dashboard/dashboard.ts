import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthStore } from '../../core/stores/auth.store';
import { PRIME_NG_IMPORTS } from '../../shared/primeng';
import { routesStrings } from '../../shared/routes';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, ...PRIME_NG_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
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
