import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PosHeader } from '../../shared/components/pos/pos-header/pos-header';
import { PosFooter } from '../../shared/components/pos/pos-footer/pos-footer';

@Component({
  selector: 'app-pos',
  imports: [RouterOutlet,PosHeader,PosFooter],
  templateUrl: './pos.html',
  styleUrl: './pos.scss',
})
export class Pos {}
