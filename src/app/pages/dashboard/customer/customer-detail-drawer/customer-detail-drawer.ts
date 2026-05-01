import { Component, Input } from '@angular/core';
import { UserDto } from '../../../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { getNameInitials } from '../../../../shared/utils/string.util';

@Component({
  selector: 'app-customer-detail-drawer',
  imports: [CommonModule],
  templateUrl: './customer-detail-drawer.html',
  styleUrl: './customer-detail-drawer.scss',
})
export class CustomerDetailDrawer {
  private _data: any;

  @Input()
  set data(val: any) {
    this._data = val;
    console.log(val);

    this.handleData(val);
  }

  ngOnInit() {

  }

  customerData:any | null = null;

  handleData(data: any) {
    if (data) {
      this.customerData = data as any;
    } else {
      this.customerData = null;
    }
  }
  get customer(): any {
    return this.customerData as any;
  }
  getInitials(): string {
    return getNameInitials(this.customer?.firstName, this.customer?.lastName);
  }


}
