import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { ThemeService } from '../../../core/services/theme';
import { PRIME_NG_IMPORTS } from '../../../shared/primeng';
import { COMMON_IMPORTS } from '../../../shared/common';
import {form, FormField} from '@angular/forms/signals';

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...PRIME_NG_IMPORTS, ...COMMON_IMPORTS, FormField],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  loginModel = signal<LoginData>({
    username: '',
    password: '',
  });
  loginForm = form(this.loginModel);
  formSubmitted: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(false);
  theme:ThemeService = inject(ThemeService);

  @ViewChild('bgVideo') video!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.video.nativeElement.playbackRate = 0.4; // 👈 slower (50% speed)
  }

  login() {

    if(this.loading()){
      return;
    }

    this.formSubmitted.set(true);
    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
    }, 2000);

    if (this.loginForm) {
      const { email, password } = this.loginForm;
      console.log('Login attempt:', { email, password });
    }
  }
}
