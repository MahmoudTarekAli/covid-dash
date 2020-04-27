import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.base_url;
  private token: string;
  public tokenSubjectSource = new BehaviorSubject<string>('');


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  public saveToken(token: string): void {
    localStorage.setItem('user-token', token);
    this.tokenSubjectSource.next(token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('user-token');
    }
    return this.token;
  }

  public saveUserId(userId) {
    localStorage.setItem('userId', userId);
  }

  public getUserRole() {
    return localStorage.getItem('user-role');
  }

  public Login($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/Login`, $userCredentials, {
      observe: 'response',
    });
  }

  isUserLoggedIn() {
    if (localStorage.getItem('user-token')) {
      return true;
    }
  }
}
