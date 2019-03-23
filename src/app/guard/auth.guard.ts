import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const status = this.auth.isLogin().pipe(map(s => {
      if (!s) {
        this.router.navigate(['/login']);
      }
      return s;
    }));

    return status;
  }
  constructor(private router: Router, private auth: AuthService) { }
}
