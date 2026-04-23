import { Component } from '@angular/core';
import { COMMON_IMPORTS } from '../../../shared/common';

@Component({
  selector: 'app-waiter',
  imports: [...COMMON_IMPORTS],
  templateUrl: './waiter.html',
  styleUrls: ['./waiter.scss'],
})
export class Waiter {}
