import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, EMPTY, from, Observable, throwError } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.match(/auth/)) {
      return next.handle(req).pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse && err.status == 401 && err.url.match(/refresh/)) {
            this.router.navigate(['/login']);
            alert('ログインの有効期限が切れました。再度ログインしてください。');
            this.authService.logout();
            return EMPTY;
          }
          console.log('/auth その他のエラー', err);
          return throwError(err);
        }),
      )
    }

    const token = this.authService.token;

    req = this.addToken(req, token);

    return next.handle(req).pipe(
      catchError(err => {
        // Token有効期限切れ等
        if (err instanceof HttpErrorResponse && err.status == 401 && !err.url.match(/refresh/)) {
          return this.handle401Error(req, next);
        }
        // その他のエラー
        return throwError(err);
      })
    );
  }

  private isTokenRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isTokenRefreshing) {
      // 現在トークンリフレッシュ試行中でない
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return from(this.authService.token_refresh()).pipe(
        switchMap(token => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(token);
          req = this.addToken(req, token);
          return next.handle(req);
        })
      );
    } else {
      // 現在トークンリフレッシュ試行中である
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(refreshed_token => {
          req = this.addToken(req, refreshed_token);
          return next.handle(req);
        }),
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }
}
