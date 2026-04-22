import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '../stores/auth.store';
import MenuItem from '../../shared/interfaces/menuItem';

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/dashboard',
    active: false,
    access: ['company-admin'],
    badge: { value: 1, color: 'accent' }
  },
  // {
  //   title: 'Orders',
  //   icon: 'receipt-text',
  //   link: '/orders',
  //   active: false,
  //   access: ['company-admin'],
  //   badge: { value: 1, color: 'accent' }
  // },
  // {
  //   title: 'Payments',
  //   icon: 'money-bills',
  //   link: '/payments',
  //   active: false,
  //   access: ['admin', 'vendor'],
  //   badge: { value: 1, color: 'accent' }
  // },
  // {
  //   title: 'Vendors',
  //   icon: 'user-square',
  //   link: '/vendors',
  //   active: false,
  //   access: ['admin'],
  //   badge: { value: 1, color: 'accent' }
  // },
  // {
  //   title: 'Products',
  //   icon: 'box',
  //   link: '/products',
  //   active: false,
  //   access: ['admin'],
  //   badge: { value: 1, color: 'accent' }
  // },
  // {
  //   title: 'Inventory',
  //   icon: 'warehouse',
  //   link: '/inventory',
  //   active: false,
  //   access: ['admin'],
  //   badge: { value: 1, color: 'accent' }
  // },
  // {
  //   title: 'Notifications',
  //   icon: 'bell-notification',
  //   link: '/notifications',
  //   active: false,
  //   access: ['admin', 'vendor'],
  //   badge: { value: 1, color: 'accent' }
  // }
];

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private router = inject(Router);
  private authStore = inject(AuthStore);

  // -------------------------
  // Signals
  // -------------------------
  private _menu = signal<MenuItem[]>(MENU_ITEMS);
  private _currentUrl = signal<string>('');

  readonly currentUrl = this._currentUrl.asReadonly();

  // Filter menu based on role (REACTIVE)
  readonly menu = computed(() => {
    const role = this.authStore.currentUser()?.role as string;

    return this._menu()
      .filter(item => !item.access || item.access.includes(role))
      .map(item => ({
        ...item,
        active: this._currentUrl().includes(item.link)
      }));
  });

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        this._currentUrl.set(event.urlAfterRedirects);
      });
  }

  // -------------------------
  // Helpers
  // -------------------------
  toggleActive(link: string) {
    this._currentUrl.set(link);
  }

  menuHasChildren(item: MenuItem): boolean {
    return !!item.children?.length;
  }
}
