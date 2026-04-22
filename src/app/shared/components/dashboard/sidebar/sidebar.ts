import { Component, inject } from '@angular/core';
import { COMMON_IMPORTS } from '../../../common';
import { AuthStore } from '../../../../core/stores/auth.store';
import { getNameInitials } from '../../../utils/string.util';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { collapse, fade } from '../../../../core/services/animation.service';

@Component({
  selector: 'app-sidebar',
  imports: [...COMMON_IMPORTS],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  animations: [fade,collapse]
})
export class Sidebar {

  // ========================
  // inject services or stores
  // ========================
  authStore: AuthStore = inject(AuthStore);
  sidebarService = inject(SidebarService);
  // ========================
  // variables and signals
  // ========================
  user = this.authStore.currentUser();
  profileName = getNameInitials(this.user?.firstName, this.user?.lastName);
}
