import { Component } from '@angular/core';
import { COMMON_IMPORTS } from '../../../shared/common';

@Component({
  selector: 'app-category',
  imports: [...COMMON_IMPORTS],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category {}
