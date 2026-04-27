import { Component, computed, inject, signal } from '@angular/core';
import { Category, ModalService } from '../../../../../core/services/modal.service';
import { COMMON_IMPORTS } from '../../../../common';
import { Modal } from '../../../../ui/modal/modal';
import { BranchDto } from '../../../../models/branch.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-branches-selection-modal',
  imports: [...COMMON_IMPORTS, Modal],
  templateUrl: './branches-selection-modal.html',
  styleUrls: ['./branches-selection-modal.scss'] ,
})
export class BranchesSelectionModal {

  // ref: DynamicDialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  searchQuery = signal('');
  selectedBranch = signal<BranchDto[] | []>([]);

  // Hardcoded branches — in real app, pass via config.data or a CategoryService
  allBranches = signal<BranchDto[]>([
    {
        address: {
            street: "DHA Phase 6",
            city: "Lahore",
            state: "Punjab",
            zipCode: "54792",
            country: "Pakistan"
        },
        companyId: "69d7bf473559f85034de03ff",
        name: "DHA Branch update",
        email: "dha@gmail.com",
        phone: "+923009876543",
        isActive: true,
        code: "DHA001",
        saleTaxReturnNumber: "",
        nationalTaxNumber: "",
        createdBy: "69d7bf0076672503a3272d7f",
        createdAt: "2026-04-10T13:29:40.513Z",
        updatedAt: "2026-04-10T16:38:27.737Z",
        id: "69d8fb4466bf0fcf0b36a9f2"
    }
  ]);

  filteredBranches = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allBranches().filter(c =>
      c.name.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    const ids: string[] = this.config.data?.value || [];
    const isMulti = this.config.data?.multiselect;

    const selected = this.allBranches().filter(b => ids.includes(b.id));

    this.selectedBranch.set(isMulti ? selected : selected.slice(0, 1));
  }

  select(branch: BranchDto) {
    const isMulti = this.config.data?.multiSelect;

    if (isMulti) {
      const current = this.selectedBranch();

      const exists = current.find(b => b.id === branch.id);

      if (exists) {
        // ❌ remove if already selected
        this.selectedBranch.set(current.filter(b => b.id !== branch.id));
      } else {
        // ✅ add
        this.selectedBranch.set([...current, branch]);
      }

    } else {
      // ✅ single select
      this.selectedBranch.set([branch]);
    }
  }

  isSelected(branch: BranchDto): boolean {
    return this.selectedBranch().some(b => b.id === branch.id);
  }
}
