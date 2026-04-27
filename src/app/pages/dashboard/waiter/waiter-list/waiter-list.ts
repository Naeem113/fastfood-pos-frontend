import { Component, inject, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { ContentHeader } from '../../../../shared/components/dashboard/content-header/content-header';
import { Router } from '@angular/router';
import { routesStrings } from '../../../../shared/routes';
import { ViewMode } from '../../../../shared/models/table.model';
import { UserDto } from '../../../../shared/models/user.model';
import { Role } from '../../../../shared/enums/role.enum';
import { GridToggleButton } from '../../../../shared/ui/grid-toggle-button/grid-toggle-button';
import { GridListHeader } from '../../../../shared/components/dashboard/grid-list-header/grid-list-header';
import { FilterPanelConfig, FilterPanelResult, StatusTogglerPopover } from '../../../../shared/components/dashboard/status-toggler-popover/status-toggler-popover';
import { PRIME_NG_IMPORTS } from '../../../../shared/primeng';
import { slideX, slideY } from '../../../../core/services/animation.service';
type StatusFilter = '' | 'active' | 'inactive';

@Component({
  selector: 'app-waiter-list',
  imports: [...COMMON_IMPORTS, ContentHeader, GridToggleButton, GridListHeader, StatusTogglerPopover, ...PRIME_NG_IMPORTS],
  templateUrl: './waiter-list.html',
  styleUrls: ['./waiter-list.scss'],
  animations: [ slideY ],
})
export class WaiterList {

  router = inject(Router);

  addWaiter() {
    this.router.navigate([routesStrings.waiter.create]);
  }
  selectedWaiters = signal<UserDto[]>([]);
  viewMode = signal<ViewMode>('grid');

  searchQuery  = '';
  statusFilter: StatusFilter = '';
  branchFilter = '';


  readonly statusOptions = [
    { label: 'All statuses', value: '' as StatusFilter },
    { label: 'Active',       value: 'active'  as StatusFilter },
    { label: 'Inactive',     value: 'inactive' as StatusFilter },
  ];

  branches: string[] = [];

  private allWaiters: UserDto[] = [];
  filteredWaiters: UserDto[] = [];

  // ── stats ─────────────────────────────────────────────
  // get stats(): WaiterStat[] {
  //   const f = this.filteredWaiters;
  //   const active   = f.filter(w => w.isActive).length;
  //   const inactive = f.length - active;
  //   const leads    = f.filter(w => w.role === Role.MANAGER || w.role === Role.SENIOR_WAITER).length;
  //   return [
  //     { label:'Total staff',     value: f.length, color:'#185FA5', bgColor:'#E6F1FB', icon:'total'    },
  //     { label:'Active',          value: active,   color:'#0F6E56', bgColor:'#E1F5EE', icon:'active'   },
  //     { label:'Inactive',        value: inactive, color:'#993C1D', bgColor:'#FAECE7', icon:'inactive' },
  //     { label:'Leads / managers',value: leads,    color:'#3C3489', bgColor:'#EEEDFE', icon:'leads'    },
  //   ];
  // }

  ngOnInit(): void {
    this.allWaiters = MOCK_WAITERS;          // ← replace with HTTP service call
    this.branches = [...new Set(this.allWaiters.map(w => w.branch?.name ?? '').filter(Boolean))];
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredWaiters = this.allWaiters.filter(w => {
      const name = `${w.firstName} ${w.lastName ?? ''} ${w.username}`.toLowerCase();
      const matchQ = !q || name.includes(q);
      const matchS = !this.statusFilter || (this.statusFilter === 'active' ? w.isActive : !w.isActive);
      const matchB = !this.branchFilter || w.branch?.name === this.branchFilter;
      return matchQ && matchS && matchB;
    });
  }

  setView(mode: ViewMode): void { this.viewMode.set(mode); }

  getInitials(u: UserDto): string {
    return (u.firstName[0] + (u.lastName?.[0] ?? '')).toUpperCase();
  }

  getRoleMeta(role: Role): { label: string; cssClass: string } {
    const map: Record<any, { label: string; cssClass: string }> = {
      [Role.WAITER]:        { label: 'Waiter',        cssClass: 'role-waiter'   },
      [Role.BRANCH_USER]:  { label: 'Branch User',   cssClass: 'role-branch'   },
      [Role.MANAGER]:      { label: 'Manager',       cssClass: 'role-manager'  },
      [Role.CASHIER]:      { label: 'Cashier',       cssClass: 'role-cashier'  },
    };
    return map[role] ?? { label: role, cssClass: 'role-waiter' };
  }


  onEdit(u: UserDto, event: Event): void {
    event.stopPropagation();
    console.log('Edit user:', u.id);
    // open edit dialog
  }

  onView(u: UserDto, event: Event): void {
    event.stopPropagation();
    console.log('View user:', u.id);
    // navigate or open detail dialog
  }

  onDelete(u: UserDto, event: Event): void {
    event.stopPropagation();
    console.log('Delete user:', u.id);
    // open confirmation dialog
  }

  trackById(_: number, u: UserDto): string { return u.id; }

  // Availability filter (matches the image exactly)
availabilityConfig: FilterPanelConfig = {
  segment: [
    { label: 'Available', value: 'available' },
    { label: 'Sold out',  value: 'sold_out', danger: true },
  ],
  expandRows: [
    {
      key:   'sort',
      label: 'Sort',
      icon:  'clock',
      multi: false,
      chips: [
        { label: 'Newest',     value: 'newest'     },
        { label: 'Oldest',     value: 'oldest'     },
        { label: 'Price low',  value: 'price_asc'  },
        { label: 'Price high', value: 'price_desc' },
      ],
    },
  ],
  cancelLabel: 'Cancel',
  applyLabel:  'Apply',
};

// Waiter filter
waiterConfig: FilterPanelConfig = {
  segment: [
    { label: 'Active',   value: true  },
    { label: 'Inactive', value: false },
  ],
  expandRows: [
    {
      key:   'role',
      label: 'Role',
      icon:  'user',
      multi: false,
      chips: [
        { label: 'Waiter',  value: 'WAITER'        },
        { label: 'Senior',  value: 'SENIOR_WAITER'  },
        { label: 'Manager', value: 'MANAGER'        },
        { label: 'Host',    value: 'HOST'           },
      ],
    },
    {
      key:   'branch',
      label: 'Branch',
      icon:  'grid',
      multi: true,
      chips: [
        { label: 'Downtown', value: 'downtown' },
        { label: 'Uptown',   value: 'uptown'   },
        { label: 'Airport',  value: 'airport'  },
      ],
    },
  ],
};

onFilterApply(result: FilterPanelResult): void {
  console.log('Filter applied:', result);
  // { segment: true, role: 'WAITER', branch: ['downtown', 'uptown'] }
}

onFilterCancel(): void {
  // close overlay / popover
}
}

const MOCK_WAITERS: any[] = [
  { id:'W-01', firstName:'Ahmed',  lastName:'Karimi',   username:'ahmed.k',  email:'ahmed@cafe.pk',  phone:'+92 300 111 2222', role:Role.WAITER,        isActive:true,  lastLogin: new Date(Date.now()-2*60000),      branch:{name:'Downtown'} },
  { id:'W-02', firstName:'Sara',   lastName:'Malik',    username:'sara.m',   email:'sara@cafe.pk',   phone:'+92 301 222 3333', role:Role.WAITER, isActive:true,  lastLogin: new Date(Date.now()-60*60000),     branch:{name:'Downtown'} },
  { id:'W-03', firstName:'Usman',  lastName:'Raza',     username:'usman.r',  email:'usman@cafe.pk',  phone:'+92 302 333 4444', role:Role.WAITER,        isActive:false, lastLogin: new Date(Date.now()-3*86400000),   branch:{name:'Uptown'}   },
  { id:'W-04', firstName:'Nadia',  lastName:'Shah',     username:'nadia.s',  email:'nadia@cafe.pk',  phone:'+92 303 444 5555', role:Role.WAITER,          isActive:true,  lastLogin: new Date(Date.now()-5*60000),      branch:{name:'Airport'}  },
  { id:'W-05', firstName:'Bilal',  lastName:'Hassan',   username:'bilal.h',  email:'bilal@cafe.pk',  phone:'+92 304 555 6666', role:Role.WAITER,       isActive:true,  lastLogin: new Date(Date.now()-60000),        branch:{name:'Downtown'} },
  { id:'W-06', firstName:'Zara',   lastName:'Qureshi',  username:'zara.q',   email:'zara@cafe.pk',   phone:'+92 305 666 7777', role:Role.WAITER,        isActive:true,  lastLogin: new Date(Date.now()-30*60000),     branch:{name:'Uptown'}   },
  { id:'W-07', firstName:'Omar',   lastName:'Siddiqui', username:'omar.s',   email:'omar@cafe.pk',   phone:'+92 306 777 8888', role:Role.WAITER,        isActive:false, lastLogin: new Date(Date.now()-7*86400000),   branch:{name:'Airport'}  },
  { id:'W-08', firstName:'Hina',   lastName:'Baig',     username:'hina.b',   email:'hina@cafe.pk',   phone:'+92 307 888 9999', role:Role.WAITER, isActive:true,  lastLogin: new Date(Date.now()-10*60000),     branch:{name:'Downtown'} },
];
