import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { User } from './user.model';

import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store
      .select('auth') //
      .pipe(
        take(1),
        map((authState) => authState.user),
        exhaustMap((user: User | null) => {
          if (!user || !user.token) {
            return next.handle(req);
          }
          const updatedReq = req.clone({
            params: new HttpParams().set('auth', user.token),
          });
          return next.handle(updatedReq);
        })
      );
  }
}
