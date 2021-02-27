import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

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
  user = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient, //
    private router: Router
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
    this.user.next(null);
    this.router.navigate(['auth']);
  }

  autoLogin() {
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
        this.user.next(user);
      }
    }
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expireIn: number) {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
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
