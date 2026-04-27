import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-items',
  imports: [RouterOutlet],
  templateUrl: './items.html',
  styleUrls: ['./items.scss'],
})
export class Items {}
