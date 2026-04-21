import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authStore: AuthStore, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from memory (secure)
    const token = this.authStore.token();

    // Add authorization header if token exists
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
    }

    // Handle response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - token expired or invalid
          this.authStore.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden - insufficient permissions
          console.error('Access forbidden');
        }
        return throwError(() => error);
      })
    );
  }
}
