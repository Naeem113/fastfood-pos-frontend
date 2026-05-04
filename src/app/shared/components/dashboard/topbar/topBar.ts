import { Component, EventEmitter, inject, Output } from '@angular/core';
import { COMMON_IMPORTS } from '../../../common';
import { AuthStore } from '../../../../core/stores/auth.store';
import { routesStrings } from '../../../routes';
import { Router } from '@angular/router';
import { getNameInitials } from '../../../utils/string.util';

@Component({
  selector: 'app-topBar',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './topBar.html',
  styleUrls: ['./topBar.scss'],
})
export class TopBar {

  @Output() toggleSidebar = new EventEmitter<boolean>(false);
  showSidebar = false;
  router = inject(Router)
  authStore = inject(AuthStore);

  profileName = getNameInitials(this.authStore.currentUser()?.firstName, this.authStore.currentUser()?.lastName);
  logout() {
    this.authStore.logout();
    this.router.navigate([routesStrings.login]);
  }

  goToPOS(){
    this.router.navigate([routesStrings.pos])
  }
}
