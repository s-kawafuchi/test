import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, from, of } from 'rxjs';
const API_HOST = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = null;

  // tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  isLoginSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private http: HttpClient) {
    const is_login = localStorage.getItem('is_login') === 'true';
    this.isLoginSubject.next(is_login);
  }

  login(param: { email: string; passwd: string }) {
    return this.http
      .post(`${API_HOST}/auth/login`, param, { withCredentials: true })
      .pipe(
        map((token: string) => {
          this.storeToken(token);
          return true;
        }),
        catchError((err) => {
          return of(false);
        })
      );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('is_login');
    this.isLoginSubject.next(false);
  }

  token_refresh() {
    return this.http
      .post(`${API_HOST}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((token: string) => {
          this.storeToken(token);
        })
      );
  }

  storeToken(token: string) {
    this.isLoginSubject.next(true);
    // localStorage.setItem('token', token);
    localStorage.setItem('is_login', 'true');
    this.token = token;
  }
}
