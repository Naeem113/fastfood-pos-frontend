import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  // 🔥 Global state signals
  loading = signal(false);
  error = signal<string | null>(null);

  // ========================
  // Generic Request Handler
  // ========================
  private async request<T>(obs: any): Promise<T> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(obs);
      return res as T;
    } catch (err: any) {
      this.error.set(err?.message || 'Something went wrong');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  // ========================
  // GET
  // ========================
  get<T>(url: string, params?: any) {
    const httpParams = new HttpParams({ fromObject: params || {} });
    return this.request<T>(this.http.get<T>(url, { params: httpParams }));
  }

  // ========================
  // POST
  // ========================
  post<T>(url: string, body: any) {
    return this.request<T>(this.http.post<T>(url, body));
  }

  // ========================
  // PUT
  // ========================
  put<T>(url: string, body: any) {
    return this.request<T>(this.http.put<T>(url, body));
  }

  // ========================
  // PATCH
  // ========================
  patch<T>(url: string, body: any) {
    return this.request<T>(this.http.patch<T>(url, body));
  }

  // ========================
  // DELETE
  // ========================
  delete<T>(url: string, body?: any) {
    return this.request<T>(
      this.http.delete<T>(url, body ? { body } : {})
    );
  }

  // ========================
  // FILE UPLOAD (IMPORTANT FIX)
  // ========================
  upload<T>(url: string, formData: FormData) {
    // ❌ DO NOT set Content-Type manually
    return this.request<T>(this.http.post<T>(url, formData));
  }

  // ========================
  // DOWNLOAD FILE
  // ========================
  download(url: string, params?: any) {
    return this.request(
      this.http.get(url, {
        params,
        responseType: 'blob'
      })
    );
  }
}
