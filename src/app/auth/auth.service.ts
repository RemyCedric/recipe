import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keyAPI = environment.FIREBASE_API_KEY;
  private tokenExpirationTime: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private http: HttpClient, //
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signup(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.keyAPI}`, {
        email: credentials.email,
        password: credentials.password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponse) => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
      );
  }

  signin(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.keyAPI}`, {
        email: credentials.email,
        password: credentials.password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponse) => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
      );
  }

  logout(): void {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
      this.tokenExpirationTime = null;
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTime = setTimeout(() => this.logout(), expirationDuration);
  }

  autoLogin(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData: {
        email: string; //
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(userData);
      const user: User = new User(
        parsedUserData.email, //
        parsedUserData.id,
        parsedUserData._token,
        new Date(parsedUserData._tokenExpirationDate)
      );
      if (user.token) {
        this.store.dispatch(new AuthActions.Login(user));
        this.autoLogout(new Date(parsedUserData._tokenExpirationDate).getTime() - new Date().getTime());
      }
    }
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expireIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.store.dispatch(new AuthActions.Login(user));
    this.autoLogout(expireIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = 'unknow error happened';

    if (errorResponse.error && errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = `the email already exist`;
          break;
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
          errorMessage = `the email or the username is incorrect`;
          break;
        default:
          errorMessage = 'an unexpected error happened';
          break;
      }
    }
    return throwError(errorMessage);
  }
}
