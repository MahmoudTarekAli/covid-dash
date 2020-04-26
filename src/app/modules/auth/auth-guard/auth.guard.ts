import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  status: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  handleGuard() {
    const token = localStorage.getItem('user-token');
    return token !== null ? true : this.router.navigateByUrl('/auth');
  }

  canActivate() {
    return this.handleGuard();
  }
}
