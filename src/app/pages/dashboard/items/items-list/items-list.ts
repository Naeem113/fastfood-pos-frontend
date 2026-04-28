import { Component, inject } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { ContentHeader } from '../../../../shared/components/dashboard/content-header/content-header';
import { Router } from '@angular/router';
import { routesStrings } from '../../../../shared/routes';

@Component({
  selector: 'app-items-list',
  imports: [...COMMON_IMPORTS, ContentHeader],
  templateUrl: './items-list.html',
  styleUrl: './items-list.scss',
})
export class ItemsList {

  router = inject(Router);

  goToCreateItem(){
    this.router.navigate([routesStrings.menu.item.create])
  }
}
