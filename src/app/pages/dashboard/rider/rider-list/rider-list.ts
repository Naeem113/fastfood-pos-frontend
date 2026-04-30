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
import { PRIME_NG_IMPORTS } from '../../../../shared/primeng';
import { slideY } from '../../../../core/services/animation.service';
import { SelectField } from '../../../../shared/primeng/select-field/select-field';
import { FormField } from "@angular/forms/signals";


interface riderFilter {
  status: boolean | null;
  branch: string | null;
  query: string;
}
@Component({
  selector: 'app-rider-list',
  imports: [...COMMON_IMPORTS, ContentHeader, GridToggleButton, GridListHeader, ...PRIME_NG_IMPORTS, SelectField, FormField],
  templateUrl: './rider-list.html',
  styleUrls: ['./rider-list.scss'],
  animations: [ slideY ],
})
export class RiderList {

  router = inject(Router);

  addRider() {
    this.router.navigate([routesStrings.restaurantSetup.rider.create]);
  }
  selectedRiders = signal<UserDto[]>([]);
  viewMode = signal<ViewMode>('grid');

  searchQuery  = '';
  statusFilter: string = '';
  branchFilter = '';

  filter: riderFilter = {
    status: null,
    branch: null,
    query: '',
  }


  readonly statusOptions = [
    { label: 'All statuses', value: null },
    { label: 'Active',       value: true },
    { label: 'Inactive',     value: false },
  ];

  branches: string[] = [];

  private allRiders: UserDto[] = [];
  filteredRiders: UserDto[] = [];

  // ── stats ─────────────────────────────────────────────
  // get stats(): RiderStat[] {
  //   const f = this.filteredRiders;
  //   const active   = f.filter(w => w.isActive).length;
  //   const inactive = f.length - active;
  //   const leads    = f.filter(w => w.role === Role.MANAGER || w.role === Role.SENIOR_RIDER).length;
  //   return [
  //     { label:'Total staff',     value: f.length, color:'#185FA5', bgColor:'#E6F1FB', icon:'total'    },
  //     { label:'Active',          value: active,   color:'#0F6E56', bgColor:'#E1F5EE', icon:'active'   },
  //     { label:'Inactive',        value: inactive, color:'#993C1D', bgColor:'#FAECE7', icon:'inactive' },
  //     { label:'Leads / managers',value: leads,    color:'#3C3489', bgColor:'#EEEDFE', icon:'leads'    },
  //   ];
  // }

  ngOnInit(): void {
    this.allRiders = MOCK_RIDERS;          // ← replace with HTTP service call
    this.branches = [...new Set(this.allRiders.map(w => w.branch?.name ?? '').filter(Boolean))];
    this.applyFilters();
  }

  OnStatusFilterChange(status: boolean | null): void {
    this.filter = {
      ...this.filter,
      status
    }
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.filter.query.toLowerCase().trim();
    this.filteredRiders = this.allRiders.filter(w => {
      const name = `${w.firstName} ${w.lastName ?? ''} ${w.username}`.toLowerCase();
      const matchQ = !q || name.includes(q);
      const matchS = this.filter.status === null || this.filter.status === w.isActive;
      const matchB = !this.filter.branch || w.branch?.name === this.filter.branch;
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
      [Role.RIDER]:        { label: 'Rider',        cssClass: 'role-rider'   },
      [Role.BRANCH_USER]:  { label: 'Branch User',   cssClass: 'role-branch'   },
      [Role.MANAGER]:      { label: 'Manager',       cssClass: 'role-manager'  },
      [Role.CASHIER]:      { label: 'Cashier',       cssClass: 'role-cashier'  },
    };
    return map[role] ?? { label: role, cssClass: 'role-rider' };
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

}

const MOCK_RIDERS: any[] = [
  { id:'R-01', firstName:'Ahmed',  lastName:'Karimi',   username:'ahmed.k',  email:'ahmed@cafe.pk',  phone:'+92 300 111 2222', role:Role.RIDER,        isActive:true,  lastLogin: new Date(Date.now()-2*60000),      branch:{name:'Downtown'} },
  { id:'R-02', firstName:'Sara',   lastName:'Malik',    username:'sara.m',   email:'sara@cafe.pk',   phone:'+92 301 222 3333', role:Role.RIDER, isActive:true,  lastLogin: new Date(Date.now()-60*60000),     branch:{name:'Downtown'} },
  { id:'R-03', firstName:'Usman',  lastName:'Raza',     username:'usman.r',  email:'usman@cafe.pk',  phone:'+92 302 333 4444', role:Role.RIDER,        isActive:false, lastLogin: new Date(Date.now()-3*86400000),   branch:{name:'Uptown'}   },
  { id:'R-04', firstName:'Nadia',  lastName:'Shah',     username:'nadia.s',  email:'nadia@cafe.pk',  phone:'+92 303 444 5555', role:Role.RIDER,          isActive:true,  lastLogin: new Date(Date.now()-5*60000),      branch:{name:'Airport'}  },
  { id:'R-05', firstName:'Bilal',  lastName:'Hassan',   username:'bilal.h',  email:'bilal@cafe.pk',  phone:'+92 304 555 6666', role:Role.RIDER,       isActive:true,  lastLogin: new Date(Date.now()-60000),        branch:{name:'Downtown'} },
  { id:'R-06', firstName:'Zara',   lastName:'Qureshi',  username:'zara.q',   email:'zara@cafe.pk',   phone:'+92 305 666 7777', role:Role.RIDER,        isActive:true,  lastLogin: new Date(Date.now()-30*60000),     branch:{name:'Uptown'}   },
  { id:'R-07', firstName:'Omar',   lastName:'Siddiqui', username:'omar.s',   email:'omar@cafe.pk',   phone:'+92 306 777 8888', role:Role.RIDER,        isActive:false, lastLogin: new Date(Date.now()-7*86400000),   branch:{name:'Airport'}  },
  { id:'R-08', firstName:'Hina',   lastName:'Baig',     username:'hina.b',   email:'hina@cafe.pk',   phone:'+92 307 888 9999', role:Role.RIDER, isActive:true,  lastLogin: new Date(Date.now()-10*60000),     branch:{name:'Downtown'} },
];
