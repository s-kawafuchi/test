import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.isLoginSubject.pipe(
      filter(val => val != null),
      take(1),
      map(is_logined => {
        if (is_logined) {
          this.router.navigate(['/home', {}]);
        } else {
          return true;
        }
      }),
    );

  }
}
