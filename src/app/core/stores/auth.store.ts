// auth.store.ts
import { Injectable, signal, computed, WritableSignal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import CryptoJS from 'crypto-js';
import { ApiResponse, ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import { URLConfig } from '../../shared/utils/url-config';
import { ILoginResponse } from '../../shared/interfaces/loginResponse';
import { IUser } from '../../shared/interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokenKey = 'pos_token';
  private userKey = 'pos_user';
  private secretKey = 'my_super_secret_key_123';

  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private cookieService = inject(CookieService);

  // -----------------------------
  // Signals
  // -----------------------------
  private _token: WritableSignal<string | null> = signal(null);
  private _user: WritableSignal<IUser | null> = signal(null);

  readonly token = computed(() => this._token());
  readonly currentUser = computed(() => this._user());
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    this.loadToken();
    this.loadUser();
  }

  // -----------------------------
  // Encrypt / Decrypt helpers
  // -----------------------------
  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  private decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // -----------------------------
  // Load token & user from cookie
  // -----------------------------
  private loadToken() {
    const encrypted = this.cookieService.get(this.tokenKey);
    if (encrypted) {
      try {
        this._token.set(this.decrypt(encrypted));
      } catch {
        this._token.set(null);
      }
    }
  }

  private loadUser() {
    const encrypted = this.cookieService.get(this.userKey);
    if (encrypted) {
      try {
        const user: IUser = JSON.parse(this.decrypt(encrypted));
        this._user.set(user);
      } catch {
        this._user.set(null);
      }
    }
  }

  // -----------------------------
  // Set token & user
  // -----------------------------
  private setToken(token: string) {
    const encrypted = this.encrypt(token);
    this.cookieService.set(this.tokenKey, encrypted, 1, '/');
    this._token.set(token);
  }

  private setUser(user: IUser) {
    const encrypted = this.encrypt(JSON.stringify(user));
    this.cookieService.set(this.userKey, encrypted, 1, '/');
    this._user.set(user);
  }

  // -----------------------------
  // Login
  // -----------------------------
  async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.apiService.post<ApiResponse<ILoginResponse>>(URLConfig.login, { username, password });

      if (response.statusCode !== 200 || !response.data || !response.data.token) {
        throw new Error(response.message || 'Login failed, try again!');
      }

      // ✅ Use full UserDto from API
      const user: IUser = response.data.user;

      this.setToken(response.data.token);
      this.setUser(user);

      this.toastService.success(`Welcome back, ${user.firstName +' '+ user.lastName}!`);
    } catch (error: any) {
      // this.toastService.error(error?.message || 'Login failed');
      throw error.error;
    }
  }

  // -----------------------------
  // Logout
  // -----------------------------
  logout(): void {
    this.cookieService.delete(this.tokenKey);
    this.cookieService.delete(this.userKey);
    this._token.set(null);
    this._user.set(null);
  }

  // -----------------------------
  // Optional: Update user in memory & cookie
  // -----------------------------
  updateUser(user: IUser) {
    this.setUser(user);
  }
}
