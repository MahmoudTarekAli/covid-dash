import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../modules/auth/services/auth.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.router.navigateByUrl(`/auth`);
      localStorage.removeItem('user-role');
      localStorage.removeItem('userId');
      localStorage.removeItem('user-token');
      localStorage.removeItem('Admin-userName');
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const ignore =
      typeof request.body === 'undefined'
      || request.body === null
      || request.body.toString() === '[object FormData]' // <-- This solves your problem
      || request.headers.has('Content-Type');
    if (ignore) {
      request = request.clone({
        setHeaders: {
          Authorization: `${localStorage.getItem('user-token')}`
        }
      });
      return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
    }

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('user-token')}`
      }
    });

    return next.handle(request).pipe(
      //   catchError(x => this.handleAuthError(x))
      // tslint:disable-next-line:max-line-length
    ); // here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70
  }
}
