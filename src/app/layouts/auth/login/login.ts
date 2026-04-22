import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { PRIME_NG_IMPORTS } from '../../../shared/primeng';
import { COMMON_IMPORTS } from '../../../shared/common';
import {form, FormField, required} from '@angular/forms/signals';
import { AuthStore } from '../../../core/stores/auth.store';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { routesStrings } from '../../../shared/routes';

interface LoginFormData {
  username: string;
  password: string;
}
const loginModel = signal<LoginFormData>({
    username: '',
    password: '',
  });
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...PRIME_NG_IMPORTS, ...COMMON_IMPORTS, FormField],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  // ========================
  // Login Form
  // ========================
  loginForm = form(loginModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
    required(schemaPath.password, {message: 'Password is required'});
  });


  // ========================
  // Variables & Signals
  // ========================
  formSubmitted: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);
  showPassword: WritableSignal<boolean> = signal(false);

  get password() {
    return this.showPassword() ? 'text' : 'password';
  }

  // ========================
  // inject services or stores
  // ========================
  router: Router = inject(Router);
  authStore: AuthStore = inject(AuthStore);
  toast: ToastService = inject(ToastService);
  theme:ThemeService = inject(ThemeService);

  // ========================
  // Constructor & Lifecycle
  // ========================
  constructor() {
    // redirect if already logged in
    if (this.authStore.isAuthenticated()) {
      this.router.navigate([routesStrings.index]);
    }
  }

  ngAfterViewInit() {
    if (this.video) {
      this.setVideoPlaybackRate();
    }
  }

  setVideoPlaybackRate() {
      this.video.nativeElement.playbackRate = 0.4; // 👈 slower (40% speed)
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }


  // ========================
  // Login Logic
  // ========================
  async login() {
    this.formSubmitted.set(true);
    this.errorMessage.set(null);
    if(this.loading() || this.loginForm().invalid()) {
      return;
    }
    this.loading.set(true);
    try {
      const { username, password } = this.loginForm().value();
      console.log('Login attempt:', { username, password });
      await this.authStore.login(username, password)
    } catch (error: any) {
      console.log(error);

      this.errorMessage.set(error?.message || 'Login failed. Please try again.');
      this.toast.error(this.errorMessage() as string);
    } finally {
      this.loading.set(false);
      this.formSubmitted.set(false);
    }
  }
}
