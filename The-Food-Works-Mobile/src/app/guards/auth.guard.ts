import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AccessService } from 'src/app/services/access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service: AccessService, private router: Router){ }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.service.userIsAuthenticated.pipe(take(1), switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.service.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }), tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/logged-out');
        }
    }));
  }
}
