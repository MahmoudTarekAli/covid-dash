import {Injectable} from '@angular/core';
import {CanActivate, CanLoad, NavigationEnd, Route, Router, RoutesRecognized} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {filter, pairwise} from 'rxjs/operators';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  status: any;
  previousUrl: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  handleGuard() {
    const token = localStorage.getItem('user-token');
    return token !== null ? true : this.router.navigateByUrl('/auth');
  }

  canActivate() {
    return this.handleGuard();
  }
  //
  // canLoad(route: Route): boolean {
  //   if (this.authService.isUserLoggedIn()) {
  //     console.log('this')
  //     return true;
  //   }
  //   this.router.navigateByUrl('/auth');
  //   console.log('this false');
  // }
}
