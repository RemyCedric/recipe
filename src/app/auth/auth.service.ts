import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expireIn: string;
  localId: string;
  registered: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keyAPI = environment.FIREBASE_API_KEY;

  constructor(private http: HttpClient) {}

  signup(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.keyAPI}`, {
      email: credentials.email,
      password: credentials.password,
      returnSecureToken: true,
    });
  }

  signin(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.keyAPI}`, {
      email: credentials.email,
      password: credentials.password,
      returnSecureToken: true,
    });
  }
}
