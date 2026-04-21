import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class Auth {
  theme = inject(ThemeService);

  toggleTheme() {
    this.theme.toggleTheme();
  }
}
