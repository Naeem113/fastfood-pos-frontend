import { Component } from '@angular/core';
import { COMMON_IMPORTS } from '../../../shared/common';

@Component({
  selector: 'app-table',
  imports: [...COMMON_IMPORTS],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
})
export class Table {}
