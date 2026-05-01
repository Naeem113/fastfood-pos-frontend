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
import { SelectField } from '../../../../shared/primeng/select-field/select-field';
import { FormField } from "@angular/forms/signals";
import { Drawer } from '../../../../shared/primeng/drawer/drawer';
import { CustomerDetailDrawer } from '../customer-detail-drawer/customer-detail-drawer';
import { CustomerFormData } from '../form';
import { DiscountType } from '../../../../shared/interfaces/discountType';

interface customerFilter {
  status: boolean | null;
  branch: string | null;
  query: string;
}

@Component({
  selector: 'app-customer-list',
  imports: [...COMMON_IMPORTS, ContentHeader, GridToggleButton, GridListHeader, StatusTogglerPopover, ...PRIME_NG_IMPORTS, SelectField, FormField, Drawer],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss'],
  animations: [ slideY ],
})
export class CustomerList {

 router = inject(Router);

 selectedCustomers = signal<UserDto[]>([]);
 viewMode = signal<ViewMode>('list');
  filter: customerFilter = {
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
  allCustomers: UserDto[] = [];
  filteredCustomers: UserDto[] = [];

  drawerOpen = signal<boolean>(false);
  drawerDesignComponent: any;
  drawerData = signal<UserDto | null>(null);

  // ── stats ─────────────────────────────────────────────
  // get stats(): CustomerStat[] {
  //   const f = this.filteredCustomers;
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
    this.allCustomers = MOCK_CUSTOMERS;          // ← replace with HTTP service call
    this.branches = [...new Set(this.allCustomers.map(w => w.branch?.name ?? '').filter(Boolean))];
    this.applyFilters();
  }

  addCustomer() {
    this.router.navigate([routesStrings.salesAndReturns.customer.create]);
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
    this.filteredCustomers = this.allCustomers.filter(w => {
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
      [Role.CUSTOMER]:      { label: 'Customer',      cssClass: 'role-customer' },
      [Role.BRANCH_USER]:  { label: 'Branch User',   cssClass: 'role-branch'   },
      [Role.MANAGER]:      { label: 'Manager',       cssClass: 'role-manager'  },
      [Role.CASHIER]:      { label: 'Cashier',       cssClass: 'role-cashier'  },
    };
    return map[role] ?? { label: role, cssClass: 'role-customer' };
  }


  onEdit(u: UserDto, event: Event): void {
    event.stopPropagation();
    console.log('Edit user:', u.id);
    // open edit dialog
  }

  onView(u: UserDto, event: Event): void {
    event.stopPropagation();
    console.log('View user:', u.id);
    this.drawerData.set(u);
    console.log(this.drawerData());

    this.drawerDesignComponent = CustomerDetailDrawer;
    this.drawerOpen.set(true);
  }

  onDelete(u: UserDto, event: Event): void {
    event.stopPropagation();
    console.log('Delete user:', u.id);
    // open confirmation dialog
  }

  trackById(_: number, u: UserDto): string { return u.id; }
}

const MOCK_CUSTOMERS: any[] = [
  {
    code: 'C-01',
    firstName: 'Ahmed',
    lastName: 'Karimi',
    phone: '+92 300 111 2222',
    gender: 'male',
    dob: new Date(1995, 4, 12),
    email: 'ahmed@cafe.pk',
    cnic: '35202-1234567-1',
    ntn: '1234567-8',
    strn: 'STRN-001',
    discount: {
      enabled: true,
      value: 10,
      type: DiscountType.Percentage,
    },
    isActive: true,
    address: {
      street: 'Street 1, Model Town',
      city: 'Lahore',
      country: 'Pakistan',
    },
    branch: { name: 'Branch 1' },
    totalSpent: 15000,
    comments: 'Frequent customer. Prefers dine-in.',
  },

  {
    code: 'C-02',
    firstName: 'Sara',
    lastName: 'Malik',
    phone: '+92 301 222 3333',
    gender: 'female',
    dob: new Date(1998, 9, 5),
    email: 'sara@cafe.pk',
    cnic: '35202-7654321-2',
    ntn: '',
    strn: '',
    discount: {
      enabled: false,
      value: 0,
      type: DiscountType.Percentage,
    },
    isActive: true,
    address: {
      street: 'Johar Town Block B',
      city: 'Lahore',
      country: 'Pakistan',
    },
    branch: { name: 'Branch 1' },
    totalSpent: 5000,
    comments: '',
  },

  {
    code: 'C-03',
    firstName: 'Usman',
    lastName: 'Raza',
    phone: '+92 302 333 4444',
    gender: 'male',
    dob: null,
    email: 'usman@cafe.pk',
    cnic: '35202-8888888-3',
    ntn: '9988776-5',
    strn: 'STRN-002',
    discount: {
      enabled: true,
      value: 500,
      type: DiscountType.Flat,
    },
    isActive: false,
    address: {
      street: 'Main Boulevard',
      city: 'Karachi',
      country: 'Pakistan',
    },
    branch: { name: 'Branch 2' },
    totalSpent: 8500,
    comments: 'Inactive due to long absence.',
  },

  {
    code: 'C-04',
    firstName: 'Nadia',
    lastName: 'Shah',
    phone: '+92 303 444 5555',
    gender: 'female',
    dob: new Date(1992, 1, 20),
    email: 'nadia@cafe.pk',
    cnic: '35202-9999999-4',
    ntn: '',
    strn: '',
    discount: {
      enabled: true,
      value: 15,
      type: DiscountType.Percentage,
    },
    isActive: true,
    address: {
      street: 'Airport Road',
      city: 'Islamabad',
      country: 'Pakistan',
    },
    branch: { name: 'Branch 3' },
    totalSpent: 12500,
    comments: 'VIP customer',
  },
];
